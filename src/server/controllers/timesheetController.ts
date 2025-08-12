import { Request, Response } from "express";
import { sendRes } from "../utils/sendRes";
import { formatDate } from "../../shared/utils/formatDates";
import {
    readTimesheetByUserIdEmploymentIdAndTimesheetMonth,
    readTimesheetsByUserId,
} from "../crud/timesheetCrud";
import { ApiTimesheet } from "../../../types/commonTypes";
import { msToFormattedHours } from "../../shared/utils/conversions";

export const getTimesheets = async (req: Request, res: Response) => {
    sendRes(res, {
        data: await readTimesheetsByUserId(req.authenticatedUser.id),
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
    const rows: ApiTimesheet[] = [];

    while (i < days) {
        const dateString = formatDate(d, "yyyy-mm-dd");
        if (!rows[i]) {
            rows[i] = {
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
                snsc: 0,
                ooamb: 0,
                oowmb: 0,
            };
        }
        if (j < data.length && data[j].date === dateString) {
            if (
                data[j].type === "Normal" ||
                data[j].type === "OT" ||
                data[j].type === "TOIL"
            ) {
                rows[i].plannedShifts.push({
                    label: `${data[j].start}-${data[j].planned_end}`,
                    ot: data[j].type === "OT",
                });
                rows[i].actualShifts.push({
                    label: `${data[j].start}-${data[j].actual_end}`,
                    overrun: data[j].planned_end !== data[j].actual_end,
                });
            } else if (
                data[j].type === "AL" ||
                data[j].type === "AL (relief)" ||
                data[j].type === "Absent (TOIL)" ||
                data[j].type === "Absent (TOIL relief)"
            ) {
                const isToil =
                    data[j].type === "Absent (TOIL)" ||
                    data[j].type === "Absent (TOIL relief)";

                rows[i].absences.push({
                    label: `${isToil ? "ABSENT" : "A/LEAVE"} (${msToFormattedHours(data[j].absent_hours)})`,
                    toil:
                        data[j].type === "Absent (TOIL)" ||
                        data[j].type === "Absent (TOIL relief)",
                });
            }
            rows[i].additionalHours += data[j].flat;
            rows[i].timeAndHalf += data[j].time_and_half;
            rows[i].double += data[j].double;
            rows[i].toil += data[j].toil;
            rows[i].lowerRate += data[j].lower_rate;
            rows[i].higherRate += data[j].higher_rate;
            rows[i].totalUsh += data[j].total_ush;
            rows[i].absentHours += data[j].absent_hours;
            rows[i].oowmb += data[j].oowmb;
            rows[i].ooamb += data[j].ooamb;
            rows[i].snsc += data[j].snsc;

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
        data: rows,
    });
};
