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
    "LUSH (GRS)",
    "HUSH (GRS)",
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
        lower_grs: 0,
        higher_grs: 0,
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
            totals.lower_grs += lowerDay;
            totals.higher_grs += higherDay;
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
                lower_grs: conversionFn(lowerDay),
                higher_grs: conversionFn(higherDay),
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

    const doc = new PDFDocument();

    doc.pipe(res);
    const h1 = (text: string, mb = 1) =>
        doc.font("Helvetica-Bold", 20).text(text).moveDown(mb);
    const h2 = (text: string, mb = 1) =>
        doc.font("Helvetica-Bold", 18).text(text).moveDown(mb);
    const h3 = (text: string, mb = 1) =>
        doc.font("Helvetica-Bold", 16).text(text).moveDown(mb);
    const h4 = (text: string, mb = 1) =>
        doc.font("Helvetica-Bold", 14).text(text).moveDown(mb);
    const h5 = (text: string, mb = 1) =>
        doc.font("Helvetica-Bold", 12).text(text).moveDown(mb);
    const p = (text: string | number, mb = 1) =>
        doc.font("Helvetica", 10).text(text).moveDown(mb);
    const b = (text: string, continued = true) =>
        doc.font("Helvetica-Bold", 10).text(text, { continued });
    const t = (data: (string | number)[][]) =>
        doc.font("Helvetica", 8).table({ data });

    h1("Section 2 USH for annual leave on relief report", 0);
    h3(`For user}`);
    p("This document is an indicative report only.");
    h2("How to use this report");

    doc.addPage({ layout: "landscape", margin: 20 });

    h4("Summary");

    t([
        summaryHeadings,
        ...reportData.map((x) => [
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
            x.lower_grs,
            x.higher_grs,
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
    ]).moveDown(1);

    reportData.forEach((x) => {
        doc.addPage({ layout: "portrait", margin: 20 });
        b(`Detailed calculation for leave taken on ${x.date}`, false).moveDown(
            0.2
        );
        t([
            shiftHeadings,
            ...x.shifts.map((row) => [
                row.date,
                row.lower,
                row.higher,
                row.eligible,
            ]),
            ["", x.total_lower, x.total_higher, x.total_eligible_worked_hours],
        ]).moveDown(1);
        b("Total LUSH for period: ");
        p(x.total_lower, 0);
        b("Total HUSH for period: ");
        p(x.total_higher);
        b("Total USH for period: ");
        p(x.total_ush);
        b("Average LUSH for period: ");
        p(x.average_lower, 0);
        b("Average HUSH for period: ");
        p(x.average_higher);
        b("Total eligible hours worked for period: ");
        p(x.total_eligible_worked_hours);
        b("LUSH given: ");
        p(x.lower_grs);
        b("HUSH given: ");
        p(x.higher_grs);
        b("Hourly rate on this day: ");
        p(x.rate);
        b("LUSH paid: ");
        p(x.lower_received);
        b("HUSH paid: ");
        p(x.higher_received);
        b("LUSH due: ");
        p(x.lower_due, 0);
        b("HUSH due: ");
        p(x.higher_due);
        b("LUSH claim: ");
        p(x.lower_claim, 0);
        b("HUSH claim: ");
        p(x.higher_claim);
        h5(`Total claim: ${x.total_claim}`);
    });

    doc.end();
    res.send();
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
