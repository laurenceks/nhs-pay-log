import { Request, Response } from "express";
import { sendRes } from "../utils/sendRes";
import { formatDate } from "../../shared/utils/formatDates";
import {
    readTimesheetByUserIdEmploymentIdAndTimesheetMonth,
    readTimesheetListByUserId,
} from "../crud/timesheetCrud";
import { ApiTimesheet } from "../../../types/commonTypes";
import { msToFormattedHours } from "../../shared/utils/conversions";

export const getTimesheetList = async (req: Request, res: Response) => {
    sendRes(res, {
        data: await readTimesheetListByUserId(req.authenticatedUser.id),
    });
};
export const getTimesheet = async (req: Request, res: Response) => {
    const d = new Date(`20${req.params.timesheetMonth}-01T00:00:00`);

    const data = await readTimesheetByUserIdEmploymentIdAndTimesheetMonth(
        req.authenticatedUser.id,
        req.params.employmentId,
        req.params.timesheetMonth
    );

    const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    let i = 0;
    let j = 0;
    const timesheet: ApiTimesheet = {
        rows: [],
        totals: {
            absentHours: 0,
            actualShift: 0,
            additionalHours: 0,
            double: 0,
            higherRate: 0,
            lowerRate: 0,
            ooamb: 0,
            oowmb: 0,
            plannedShift: 0,
            snsc: 0,
            timeAndHalf: 0,
            toil: 0,
            totalUsh: 0,
        },
    };

    while (i < days) {
        const dateString = formatDate(d, "yyyy-mm-dd");
        if (!timesheet.rows[i]) {
            timesheet.rows[i] = {
                date: dateString,
                plannedShifts: [],
                actualShifts: [],
                absences: [],
                additionalHours: 0,
                timeAndHalf: 0,
                double: 0,
                toil: 0,
                lowerRate: 0,
                higherRate: 0,
                totalUsh: 0,
                absentHours: 0,
                plannedShift: 0,
                actualShift: 0,
                snsc: 0,
                ooamb: 0,
                oowmb: 0,
                overrun: false,
                sick: false,
                notes: "",
            };
        }
        if (j < data.length && data[j].date === dateString) {
            if (
                data[j].type === "Normal" ||
                data[j].type === "Bank" ||
                data[j].type === "OT" ||
                data[j].type === "TOIL"
            ) {
                timesheet.rows[i].plannedShifts.push({
                    label: `${data[j].start}-${data[j].planned_end}`,
                    ot: data[j].type === "OT",
                });
                timesheet.rows[i].actualShifts.push({
                    label: `${data[j].start}-${data[j].actual_end}`,
                    overrun: data[j].planned_end !== data[j].actual_end,
                });
            } else if (
                data[j].type === "AL" ||
                data[j].type === "AL (relief)" ||
                data[j].type === "Absent (TOIL)" ||
                data[j].type === "Absent (TOIL relief)" ||
                data[j].type === "Sick"
            ) {
                const absent =
                    data[j].type === "Absent (TOIL)" ||
                    data[j].type === "Absent (TOIL relief)" ||
                    data[j].type === "Sick";

                timesheet.rows[i].absences.push({
                    label: `${absent ? "ABSENT" : "A/LEAVE"} (${msToFormattedHours(data[j].absent_hours)})`,
                    toil:
                        data[j].type === "Absent (TOIL)" ||
                        data[j].type === "Absent (TOIL relief)",
                });
            }
            timesheet.rows[i].additionalHours += data[j].flat;
            timesheet.rows[i].plannedShift += data[j].planned_shift;
            timesheet.rows[i].actualShift += data[j].actual_shift;
            timesheet.rows[i].timeAndHalf += data[j].time_and_half;
            timesheet.rows[i].double += data[j].double;
            timesheet.rows[i].toil += data[j].toil;
            timesheet.rows[i].lowerRate += data[j].lower_rate;
            timesheet.rows[i].higherRate += data[j].higher_rate;
            timesheet.rows[i].totalUsh += data[j].total_ush;
            timesheet.rows[i].absentHours += data[j].absent_hours;
            timesheet.rows[i].oowmb += data[j].oowmb;
            timesheet.rows[i].ooamb += data[j].ooamb;
            timesheet.rows[i].snsc += data[j].snsc;
            timesheet.rows[i].notes += data[j].notes;
            timesheet.rows[i].overrun =
                timesheet.rows[i].overrun ||
                data[j].planned_end !== data[j].actual_end;
            timesheet.rows[i].sick =
                timesheet.rows[i].sick || data[j].type === "Sick";

            timesheet.totals.additionalHours += data[j].flat;
            timesheet.totals.plannedShift += data[j].planned_shift;
            timesheet.totals.actualShift += data[j].actual_shift;
            timesheet.totals.timeAndHalf += data[j].time_and_half;
            timesheet.totals.double += data[j].double;
            timesheet.totals.toil += data[j].toil;
            timesheet.totals.lowerRate += data[j].lower_rate;
            timesheet.totals.higherRate += data[j].higher_rate;
            timesheet.totals.totalUsh += data[j].total_ush;
            timesheet.totals.absentHours += data[j].absent_hours;
            timesheet.totals.oowmb += data[j].oowmb;
            timesheet.totals.ooamb += data[j].ooamb;
            timesheet.totals.snsc += data[j].snsc;

            if (data[j + 1]?.date !== dateString) {
                d.setDate(d.getDate() + 1);
                i += 1;
            }
            j += 1;
        } else {
            d.setDate(d.getDate() + 1);
            i += 1;
        }
    }

    sendRes(res, {
        data: timesheet,
    });
};
