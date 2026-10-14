import { sendErrorRes, sendRes } from "../utils/sendRes";
import { Request, Response } from "express";
import {
    createEmployment,
    deleteEmploymentByUserIdAndEmploymentId,
    readEmploymentsByUserId,
    updateEmploymentByUserIdAndEmploymentId,
} from "../crud/employmentCrud";
import {
    createContract,
    deleteContractsByEmploymentAndUserId,
    readContractsByUserId,
    readLatestContractPayGroupIdByUserId,
} from "../crud/contractCrud";
import { Contract, ReportData } from "../../../types/commonTypes";
import {
    readLogForReportByUserIdAndEmploymentId,
    readLogIdsByUserIdAndEmploymentId,
    readLogWithNoAlternativeEmploymentByUserId,
    readOrphanedLogByUserIdAndEmploymentIdAndNewFromOrTo,
    updateOrphanedLogShiftByUserIdAndFormerEmploymentID,
} from "../crud/logCrud";
import allowFirstFromAndLastTo from "../../shared/utils/allowFirstFromAndLastTo";
import { formatDate } from "../../shared/utils/formatDates";
import { recalculateLogByEmploymentId } from "./logController";
import {
    convertToGbp,
    decimalHoursToMs,
    msToDecimalHours,
    msToFormattedHours,
} from "../../shared/utils/conversions";
import { calculateSection2, Section2Shift } from "section-2";
import { PDFDocument } from "pdfkit";

export const getEmployments = async (req: Request, res: Response) => {
    try {
        const employments = await readEmploymentsByUserId(
            req.authenticatedUser.id
        );
        sendRes(res, { data: employments });
    } catch (_e) {
        sendErrorRes(res);
    }
};

const margins = {
    top: 20,
    bottom: 70,
    left: 20,
    right: 20,
};

const weeksLabelMap = {
    average13: "13",
    average52: "52",
    best: "Best of 13 or 52",
};

const summaryHeadings = [
    "Date",
    "Weeks",
    "Total LUSH",
    "Total HUSH",
    "Total eligible hours worked",
    "Average LUSH",
    "Average HUSH",
    "Hours of leave",
    "LUSH (calculated)",
    "HUSH (calculated)",
    "LUSH (recorded)",
    "HUSH (recorded)",
    "LUSH diff",
    "HUSH diff",
    "Hourly rate",
    "LUSH due",
    "HUSH due",
    "LUSH received",
    "HUSH received",
    "LUSH claim",
    "HUSH claim",
    "Total claim",
];

const shiftHeadings = ["Date", "LUSH", "HUSH", "Eligible worked hours"];

export const getLeaveOnReliefUshReportByEmploymentId = async (
    req: Request,
    res: Response
) => {
    const employmentShifts = await readLogForReportByUserIdAndEmploymentId(
        req.authenticatedUser.id,
        req.params.employmentId
    );

    const reportData: ReportData[] = [];
    const conversionFn =
        req.query.useDecimals === "1" ? msToDecimalHours : msToFormattedHours;

    const totals = {
        total_lower: 0,
        total_higher: 0,
        total_eligible_worked_hours: 0,
        average_lower: 0,
        average_higher: 0,
        leave_hours: 0,
        lower_rate: 0,
        higher_rate: 0,
        lower_recorded: 0,
        higher_recorded: 0,
        lower_diff: 0,
        higher_diff: 0,
        lower_due: 0,
        higher_due: 0,
        lower_received: 0,
        higher_received: 0,
        lower_claim: 0,
        higher_claim: 0,
        total_claim: 0,
    };

    employmentShifts.forEach((x) => {
        if (
            (x.type === "AL (relief)" || x.type === "Absent (TOIL relief)") &&
            (x.leave_relief_ush_type === "average13" ||
                x.leave_relief_ush_type === "average52" ||
                x.leave_relief_ush_type === "best")
        ) {
            const s2 = calculateSection2(
                {
                    ...x,
                    shifts: employmentShifts as unknown as Section2Shift[],
                },
                { ...x }
            );
            const lowerDay = decimalHoursToMs(
                new Date(x.date).getDay() ? (x.date >= "2026-02-25" ? 3 : 2) : 0
            );
            const higherDay = decimalHoursToMs(
                new Date(x.date).getDay() ? 0 : x.date >= "2026-02-25" ? 3 : 2
            );
            const lowerDue =
                msToDecimalHours(s2.lower_rate) *
                Number(x.rate) *
                x.lower_rate_multiplier;
            const higherDue =
                msToDecimalHours(s2.higher_rate) *
                Number(x.rate) *
                x.higher_rate_multiplier;
            const lowerReceived =
                msToDecimalHours(lowerDay) *
                Number(x.rate) *
                x.lower_rate_multiplier;
            const higherReceived =
                msToDecimalHours(higherDay) *
                Number(x.rate) *
                x.higher_rate_multiplier;

            totals.total_lower += s2.lower_rate;
            totals.total_higher += s2.higher_rate;
            totals.total_eligible_worked_hours +=
                s2.leave_on_relief_ush_details?.total_eligible_worked_hours ||
                0;
            totals.average_lower +=
                s2.leave_on_relief_ush_details?.average_lower || 0;
            totals.average_higher +=
                s2.leave_on_relief_ush_details?.average_higher || 0;
            totals.leave_hours +=
                s2.leave_on_relief_ush_details?.leave_hours || 0;
            totals.lower_rate += s2.lower_rate;
            totals.higher_rate += s2.higher_rate;
            totals.lower_recorded += lowerDay;
            totals.higher_recorded += higherDay;
            totals.lower_diff += s2.lower_rate - lowerDay;
            totals.higher_diff += s2.higher_rate - higherDay;
            totals.lower_due += lowerDue;
            totals.higher_due += higherDue;
            totals.lower_received += lowerReceived;
            totals.higher_received += higherReceived;
            totals.lower_claim += higherDue - higherReceived;
            totals.higher_claim += lowerDue - lowerReceived;
            totals.total_claim +=
                lowerDue + higherDue - (lowerReceived + higherReceived);

            reportData.push({
                date: formatDate(x.date, "dd/mm/yy"),
                weeksLabel: weeksLabelMap[x.leave_relief_ush_type],
                total_lower: conversionFn(
                    s2.leave_on_relief_ush_details?.total_lower || 0
                ),
                total_higher: conversionFn(
                    s2.leave_on_relief_ush_details?.total_higher || 0
                ),
                total_ush: conversionFn(
                    (s2.leave_on_relief_ush_details?.total_lower || 0) +
                        (s2.leave_on_relief_ush_details?.total_higher || 0)
                ),
                total_eligible_worked_hours: conversionFn(
                    s2.leave_on_relief_ush_details
                        ?.total_eligible_worked_hours || 0
                ),
                average_lower: conversionFn(
                    decimalHoursToMs(
                        s2.leave_on_relief_ush_details?.average_lower || 0
                    )
                ),
                average_higher: conversionFn(
                    decimalHoursToMs(
                        s2.leave_on_relief_ush_details?.average_higher || 0
                    )
                ),
                leave_hours: conversionFn(
                    s2.leave_on_relief_ush_details?.leave_hours || 0
                ),
                lower_rate: conversionFn(s2.lower_rate),
                higher_rate: conversionFn(s2.higher_rate),
                lower_recorded: conversionFn(lowerDay),
                higher_recorded: conversionFn(higherDay),
                lower_diff: conversionFn(lowerDay - s2.lower_rate),
                higher_diff: conversionFn(higherDay - s2.higher_rate),
                rate: convertToGbp(Number(x.rate)),
                lower_due: convertToGbp(lowerDue),
                higher_due: convertToGbp(higherDue),
                lower_received: convertToGbp(lowerReceived),
                higher_received: convertToGbp(higherReceived),
                lower_claim: convertToGbp(lowerDue - lowerReceived),
                higher_claim: convertToGbp(higherDue - higherReceived),
                total_claim: convertToGbp(
                    lowerDue + higherDue - (lowerReceived + higherReceived)
                ),
                shifts:
                    s2.leave_on_relief_ush_details?.shifts.map((shift) => ({
                        date: formatDate(shift.date, "dd/mm/yy"),
                        lower: conversionFn(shift.lower_rate),
                        higher: conversionFn(shift.higher_rate),
                        eligible: conversionFn(
                            Math.max(
                                0,
                                shift.actual_hours -
                                    shift.time_and_half -
                                    shift.double -
                                    (shift.overrun_type === "TOIL"
                                        ? shift.overrun_hours || 0
                                        : 0)
                            )
                        ),
                    })) || [],
            });
        }
    });

    const doc = new PDFDocument({
        bufferPages: true,
        margins,
    }).fillColor("#212529");

    doc.pipe(res);
    const h1 = (text: string, mb = 1) =>
        doc
            .font("Helvetica-Bold", 20)
            .fillColor("#212529")
            .text(text)
            .moveDown(mb);
    const h2 = (text: string, mb = 1) =>
        doc
            .font("Helvetica-Bold", 18)
            .fillColor("#212529")
            .text(text)
            .moveDown(mb);
    const h3 = (text: string, mb = 1) =>
        doc
            .font("Helvetica-Bold", 16)
            .fillColor("#212529")
            .text(text)
            .moveDown(mb);
    const h4 = (text: string, mb = 1) =>
        doc
            .font("Helvetica-Bold", 14)
            .fillColor("#212529")
            .text(text)
            .moveDown(mb);
    const h5 = (text: string, mb = 1) =>
        doc
            .font("Helvetica-Bold", 12)
            .fillColor("#212529")
            .text(text)
            .moveDown(mb);
    const p = ({
        text,
        mb = 1,
        continued = false,
        link = null,
        underline = false,
        colour = null,
    }: {
        text: string | number;
        mb?: number;
        continued?: boolean;
        link?: string | null;
        underline?: boolean;
        colour?: string | null;
    }) =>
        doc
            .font("Helvetica", 10)
            .fillColor(colour ?? "#212529")
            .text(text, { continued, link, underline })
            .moveDown(mb);

    const a = ({
        text,
        mb = 1,
        link = null,
        continued = true,
    }: {
        text: string | number;
        mb?: number;
        link?: string | null;
        continued?: boolean;
    }) =>
        p({
            text,
            mb,
            link,
            continued: continued,
            underline: true,
            colour: "#3459e6",
        });
    const b = (text: string, continued = true) =>
        doc
            .font("Helvetica-Bold", 10)
            .fillColor("#212529")
            .text(text, { continued });
    const t = (
        headings: (string | number)[],
        rows: (string | number)[][],
        footer?: (string | number)[]
    ) => {
        const t = doc
            .font("Helvetica-Bold", 8)
            .fillColor("#212529")
            .table({
                rowStyles: (i: number) => {
                    if (i === 0) {
                        return { border: [0, 0, 1, 0], borderColor: "black" };
                    } else if (footer && i === rows.length + 1) {
                        return { border: [1, 0, 0, 0], borderColor: "black" };
                    } else if (!footer && i === rows.length + 1) {
                        return { border: false };
                    } else {
                        return {
                            border: [0, 0, 0.5, 0],
                            borderColor: "#e9ecef",
                        };
                    }
                },
            });
        t.row(headings);
        doc.font("Helvetica", 6).fillColor("#212529");
        rows.forEach((x) => t.row(x));
        if (footer) {
            doc.font("Helvetica-Bold", 6).fillColor("#212529");
            t.row(footer);
            doc.font("Helvetica", 6).fillColor("#212529");
        }
        t.end();
        doc.moveDown(1);
    };

    const ul = (bullets: (string | number)[], mb = 1) =>
        doc
            .font("Helvetica", 10)
            .fillColor("#212529")
            .list(bullets, { bulletRadius: 1.5 })
            .moveDown(mb);

    doc.moveDown(10);

    h1("Section 2 USH for annual leave on relief report", 2);
    h3(`For \${user}`, 5);
    p({
        text: `Generated at ${formatDate(new Date(), "dd/mm/yy hh:mm")} using the `,
        mb: 0,
        continued: true,
    });
    a({
        text: "NHS Pay Log app",
        mb: 0,
        link: "https://pay.laurencesummers.com",
        continued: false,
    });
    doc.addPage({ margins });
    h2("How to use this report");
    p({
        text: `This document is an indicative report only. It has been generated in good faith based on the data recorded in the shift log of \${user} as an indication of potential pay discrepancies. It is the responsibility of \${user} to verify the information contained within.`,
        mb: 2,
    });
    h3("Definitions");

    ul([
        "Weeks — the lookback period used to calculate the USH entitlements",
        "LUSH — lower rate of unsocial hours",
        "HUSH — higher rate of unsocial hours",
        "LUSH/HUSH (calculated) — the calculated LUSH/HUSH earned according to the averaging calculation",
        "LUSH/HUSH (recorded) — the recorded LUSH/HUSH earned according to the user's timesheet",
        "LUSH/HUSH (due) — the monetary value of LUSH/HUSH (calculated)",
        "LUSH/HUSH (received) — the monetary value of LUSH/HUSH (recorded)",
        `LUSH/HUSH (claim) — the amount LUSH/HUSH (due) - LUSH/HUSH (received) (i.e. the pay remediation due to \${user}, if any) `,
    ]);

    doc.addPage({ layout: "landscape", margins });

    h4("Summary");

    t(
        summaryHeadings,
        reportData.map((x) => [
            x.date,
            x.weeksLabel,
            x.total_lower,
            x.total_higher,
            x.total_eligible_worked_hours,
            x.average_lower,
            x.average_higher,
            x.leave_hours,
            x.lower_rate,
            x.higher_rate,
            x.lower_recorded,
            x.higher_recorded,
            x.lower_diff,
            x.higher_diff,
            x.rate,
            x.lower_due,
            x.higher_due,
            x.lower_received,
            x.higher_received,
            x.lower_claim,
            x.higher_claim,
            x.total_claim,
        ]),
        [
            "",
            "",
            conversionFn(totals.total_lower),
            conversionFn(totals.total_higher),
            conversionFn(totals.total_eligible_worked_hours),
            "",
            "",
            conversionFn(totals.leave_hours),
            conversionFn(totals.lower_rate),
            conversionFn(totals.higher_rate),
            conversionFn(totals.lower_recorded),
            conversionFn(totals.higher_recorded),
            conversionFn(totals.lower_diff),
            conversionFn(totals.higher_diff),
            "",
            convertToGbp(totals.lower_due),
            convertToGbp(totals.higher_due),
            convertToGbp(totals.lower_received),
            convertToGbp(totals.higher_received),
            convertToGbp(totals.lower_claim),
            convertToGbp(totals.higher_claim),
            convertToGbp(totals.total_claim),
        ]
    );

    reportData.forEach((x) => {
        doc.addPage({ layout: "portrait", margins });
        b(`Detailed calculation for leave taken on ${x.date}`, false).moveDown(
            0.2
        );
        t(
            shiftHeadings,
            x.shifts.map((row) => [
                row.date,
                row.lower,
                row.higher,
                row.eligible,
            ]),
            ["", x.total_lower, x.total_higher, x.total_eligible_worked_hours]
        );
        b("Total LUSH for period: ");
        p({ text: x.total_lower, mb: 0 });
        b("Total HUSH for period: ");
        p({ text: x.total_higher });
        b("Total USH for period: ");
        p({ text: x.total_ush });
        b("Total eligible hours worked for period: ");
        p({ text: x.total_eligible_worked_hours });
        b("Average LUSH for period: ");
        p({ text: x.average_lower, mb: 0 });
        b("Average HUSH for period: ");
        p({ text: x.average_higher });
        b("LUSH recorded: ");
        p({ text: x.lower_recorded });
        b("HUSH recorded: ");
        p({ text: x.higher_recorded });
        b("Hourly rate on this day: ");
        p({ text: x.rate });
        b("LUSH received: ");
        p({ text: x.lower_received });
        b("HUSH received: ");
        p({ text: x.higher_received });
        b("LUSH due: ");
        p({ text: x.lower_due, mb: 0 });
        b("HUSH due: ");
        p({ text: x.higher_due });
        b("LUSH claim: ");
        p({ text: x.lower_claim, mb: 0 });
        b("HUSH claim: ");
        p({ text: x.higher_claim });
        h5(`Total claim: ${x.total_claim}`);
    });

    doc.addPage({ margins });

    h2("Appendix A - complete list of shifts");

    const allTotals = {
        eligible: 0,
        lower: 0,
        higher: 0,
    };

    t(
        [
            "Date",
            "Type",
            "Start",
            "Planned end",
            "Actual end",
            "Overrun type",
            "Eligible worked hours",
            "LUSH",
            "HUSH",
        ],
        employmentShifts.map((x) => {
            const eligible = Math.max(
                0,
                x.actual_hours -
                    x.time_and_half -
                    x.double -
                    (x.overrun_type === "TOIL" ? x.overrun_hours || 0 : 0)
            );
            allTotals.eligible += eligible;
            allTotals.lower += x.lower_rate;
            allTotals.higher += x.higher_rate;
            return [
                formatDate(x.date, "dd/mm/yy"),
                x.type,
                x.start,
                x.planned_end,
                x.actual_end,
                x.overrun_type,
                conversionFn(eligible),
                conversionFn(x.lower_rate),
                conversionFn(x.higher_rate),
            ];
        }),
        [
            "",
            "",
            "",
            "",
            "",
            "",
            conversionFn(allTotals.eligible),
            conversionFn(allTotals.lower),
            conversionFn(allTotals.higher),
        ]
    );

    const range = doc.bufferedPageRange();

    for (let i = range.start + 1; i < range.start + range.count; i++) {
        doc.switchToPage(i);

        const originalBottom = doc.page.margins.bottom;
        doc.page.margins.bottom = 20;

        doc.font("Helvetica", 8)
            .fillColor("#6c757d")
            .text(
                `Page ${i - range.start + 1} of ${range.count}`,
                20,
                doc.page.height - 40,
                {
                    width: doc.page.width - 40,
                    align: "center",
                    lineBreak: false,
                }
            );
        doc.page.margins.bottom = originalBottom;
    }

    doc.end();
};
export const postEmployment = async (req: Request, res: Response) => {
    try {
        const { insertId } = await createEmployment(
            req.authenticatedUser.id,
            "My job"
        );
        const [{ pay_group_id }] = await readLatestContractPayGroupIdByUserId(
            req.authenticatedUser.id
        );
        //TODO check if personalAllowance should be 0 here? Why not default for the year?
        await createContract(
            req.authenticatedUser.id,
            insertId,
            pay_group_id,
            null,
            0,
            0,
            null,
            0
        );
        sendRes(res, {
            title: "Employment saved",
            message: "Employment saved",
        });
    } catch (_e) {
        sendErrorRes(res);
    }
};
export const patchEmployment = async (req: Request, res: Response) => {
    try {
        let orphanedShifts = [];
        if (
            !!req.body.contracts[0]?.from ||
            !!req.body.contracts[req.body.contracts.length - 1]?.to
        ) {
            //make sure no shifts will be orphaned by setting the from/to of the employment
            orphanedShifts =
                await readOrphanedLogByUserIdAndEmploymentIdAndNewFromOrTo(
                    req.authenticatedUser.id,
                    req.params.employmentId,
                    req.body.contracts[0]?.from,
                    req.body.contracts[req.body.contracts.length - 1]?.to
                );
        }

        if (orphanedShifts.length) {
            sendErrorRes(res, null, {
                title: "Invalid date range",
                message: `${orphanedShifts.length} shifts from this employment fall outside its date range`,
            });
        } else {
            await deleteContractsByEmploymentAndUserId(
                req.authenticatedUser.id,
                req.params.employmentId
            );
            await updateEmploymentByUserIdAndEmploymentId(
                req.authenticatedUser.id,
                req.params.employmentId,
                req.body.name
            );
            for (const contract of req.body.contracts as Contract[]) {
                await createContract(
                    req.authenticatedUser.id,
                    req.params.employmentId,
                    contract.pay_group_id,
                    contract.hca_group_id,
                    contract.weekly_hours,
                    contract.pension_perc,
                    contract.student_loan,
                    contract.personal_allowance,
                    contract.cumulative ? 1 : 0,
                    contract.from,
                    contract.to,
                    contract.half_is_all_ush ? 1 : 0,
                    contract.break_from_higher ? 1 : 0,
                    contract.leave_relief_ush_type
                );
            }
            await recalculateLogByEmploymentId(
                req.authenticatedUser.id,
                req.params.employmentId
            );
            sendRes(res, {
                title: "Employment saved",
                message: `${req.body.name} saved`,
            });
        }
    } catch (e) {
        if ((e as { code: string }).code === "ER_NO_REFERENCED_ROW_2") {
            sendErrorRes(res, null, {
                title: "Unknown employment ID",
                message: "The given employment does not exist",
            });
        } else {
            sendErrorRes(res);
        }
    }
};
export const deleteEmployment = async (req: Request, res: Response) => {
    try {
        const employments = await readEmploymentsByUserId(
            req.authenticatedUser.id
        );
        const contracts = await readContractsByUserId(req.authenticatedUser.id);
        if (employments.length <= 1) {
            sendErrorRes(res, null, {
                errorCode: "employmentDeleteError",
                title: "Unable to delete",
                message: `You must have at least one employment`,
            });
        } else {
            const { allowFirstFrom, allowLastTo } = allowFirstFromAndLastTo(
                Number(req.params.employmentId),
                contracts
            );

            if (allowFirstFrom && allowLastTo) {
                const shiftsThatWillBeOrphaned =
                    await readLogWithNoAlternativeEmploymentByUserId(
                        req.authenticatedUser.id,
                        req.params.employmentId
                    );

                if (shiftsThatWillBeOrphaned.length) {
                    sendErrorRes(res, null, {
                        errorCode: "employmentDeleteError",
                        title: "Unable to delete",
                        message: `${shiftsThatWillBeOrphaned.length} shift${shiftsThatWillBeOrphaned.length === 1 ? "" : "s"} from this employment can't be transferred to other employments - change them manually to delete the shift:\n${shiftsThatWillBeOrphaned.map((x) => formatDate(x.date, "dd/mm/yy")).join("\n")}`,
                    });
                } else {
                    await updateOrphanedLogShiftByUserIdAndFormerEmploymentID(
                        req.authenticatedUser.id,
                        req.params.employmentId
                    );
                    const remainingShifts =
                        await readLogIdsByUserIdAndEmploymentId(
                            req.authenticatedUser.id,
                            req.params.employmentId
                        );
                    if (remainingShifts.length) {
                        //should not be possible - there are shifts left after the change
                        sendErrorRes(res, null, {
                            errorCode: "employmentDeleteError",
                            title: "Unable to delete",
                            message: `${remainingShifts.length} shift${remainingShifts.length === 1 ? "" : "s"} from this employment could not be transferred to other employments`,
                        });
                    } else {
                        await deleteContractsByEmploymentAndUserId(
                            req.authenticatedUser.id,
                            req.params.employmentId
                        );
                        await deleteEmploymentByUserIdAndEmploymentId(
                            req.authenticatedUser.id,
                            req.params.employmentId
                        );
                        sendRes(res, {
                            title: "Employment deleted",
                            message: `Employment deleted`,
                        });
                    }
                }
            } else {
                //there isn't another employment with a null from/to
                sendErrorRes(res, "validationError", {
                    title: "Unable to delete",
                    message:
                        "At least one employment must have one contract with no from and no to",
                });
            }
        }
    } catch (e) {
        console.log(e);
        sendErrorRes(res);
    }
};
