import { Request, Response } from "express";
import { sendErrorRes, sendRes } from "../utils/sendRes";
import {
    createLogShift,
    deleteLogShiftByUserIdAndShiftId,
    readAffectedLogByUserIdAndShiftId,
    readLogByUserId,
    readLogByUserIdAndEmploymentId,
    readLogShiftByUserIdAndShiftId,
    readUshAverageLogByUserIdAndEmploymentId,
    updateLogShiftByUserIdAndShiftId,
} from "../crud/logCrud";
import { createLogExtra, deleteLogExtraByShiftId } from "../crud/logExtraCrud";
import { decimalHoursToMs } from "../../shared/utils/conversions";
import {
    calculateAdditionalHours,
    calculateSection2,
    calculateUsh,
    LeaveReliefUsh,
} from "section-2";

const leaveOnReliefUshWeeksMap: { [key in LeaveReliefUsh]: 0 | 13 | 52 } = {
    average13: 13,
    average52: 52,
    best: 52,
    flat: 0,
    none: 0,
    manual: 0,
};

const updateAffectedShifts = async (
    userId: string,
    from: string,
    employmentId: string | number
) => {
    //TODO - needs to also select shifts from previously selected employment if its changing --> DONE?
    //TODO - change to just use section2 master formula for consistency
    const affectedShifts = await readAffectedLogByUserIdAndShiftId(
        userId,
        from,
        employmentId
    );
    for (const shift of affectedShifts) {
        const additionalHours = calculateAdditionalHours(
            {
                ...shift,
                from: new Date(shift.from),
                planned_to: new Date(shift.planned_to),
                actual_to: new Date(shift.actual_to),
                weekly_hours: decimalHoursToMs(shift.weekly_hours),
            },
            affectedShifts
        );
        const logWeeks = leaveOnReliefUshWeeksMap[shift.leave_relief_ush_type];
        const log =
            logWeeks &&
            (shift.type === "AL (relief)" ||
                shift.type === "Absent (TOIL relief)")
                ? await readUshAverageLogByUserIdAndEmploymentId(
                      userId,
                      from,
                      employmentId,
                      logWeeks
                  )
                : [];

        await updateLogShiftByUserIdAndShiftId(userId, {
            ...shift,
            ...{
                ...calculateUsh({
                    from: new Date(shift.from),
                    planned_to: new Date(shift.planned_to),
                    type: shift.type,
                    hours_over_threshold:
                        additionalHours.time_and_half + additionalHours.double,
                    break_override: shift.break_override,
                    shifts: log,
                    half_is_all_ush: !!shift.half_is_all_ush,
                    break_from_higher: !!shift.break_from_higher,
                    overrun_type: shift.overrun_type,
                    actual_to: new Date(shift.actual_to),
                    leave_relief_ush_type: shift.leave_relief_ush_type,
                    employment_id: shift.employment_id,
                }),
                ...additionalHours,
            },
        });
    }
};
export const recalculateLogByEmploymentId = async (
    userId: string,
    employmentId: string
) => {
    const employmentShifts = await readLogByUserIdAndEmploymentId(
        userId,
        employmentId
    );
    for (const shift of employmentShifts) {
        if (
            shift.type === "AL (relief)" ||
            shift.type === "Absent (TOIL relief)"
        ) {
            console.log(shift);
        }
        await updateLogShiftByUserIdAndShiftId(userId, {
            ...shift,
            ...calculateSection2(
                { ...shift, shifts: employmentShifts },
                {
                    weekly_hours: decimalHoursToMs(shift.weekly_hours),
                    break_from_higher: !!shift.break_from_higher,
                    half_is_all_ush: !!shift.half_is_all_ush,
                    leave_relief_ush_type: shift.leave_relief_ush_type,
                }
            ),
        });
    }
};

const updateLogExtras = async (
    shiftId: string | number,
    extrasIdsString: string
) => {
    const extraIds = extrasIdsString?.split(",").filter(Boolean);
    if (extraIds?.length) {
        for (const extraId of extraIds) {
            await createLogExtra(shiftId, extraId);
        }
    }
};
export const getLog = async (req: Request, res: Response) => {
    const data = await readLogByUserId(req.authenticatedUser.id);
    sendRes(res, {
        title: "Log refreshed",
        message: "Log data refreshed",
        data: data,
    });
};
export const getLogShift = async (req: Request, res: Response) => {
    const [data] = await readLogShiftByUserIdAndShiftId(
        req.authenticatedUser.id,
        req.params.shiftId
    );
    if (data) {
        sendRes(res, { data: data });
    } else {
        //TODO make this a proper 404
        sendErrorRes(res);
    }
};
export const postLogShift = async (req: Request, res: Response) => {
    try {
        const { insertId } = await createLogShift(
            req.authenticatedUser.id,
            req.body
        );
        if (insertId) {
            await updateAffectedShifts(
                req.authenticatedUser.id,
                req.body.from,
                req.body.employment_id
            );
            await updateLogExtras(insertId, req.body.extras_ids_string);
            sendRes(res);
        } else {
            sendErrorRes(res);
        }
    } catch (_e) {
        sendErrorRes(res);
    }
};
export const patchLogShift = async (req: Request, res: Response) => {
    try {
        const [{ employment_id: oldEmploymentId }] =
            await readLogShiftByUserIdAndShiftId(
                req.authenticatedUser.id,
                req.params.shiftId
            );
        await updateLogShiftByUserIdAndShiftId(
            req.authenticatedUser.id,
            req.body
        );
        await updateAffectedShifts(
            req.authenticatedUser.id,
            req.body.from,
            oldEmploymentId
        );
        await updateAffectedShifts(
            req.authenticatedUser.id,
            req.body.from,
            req.body.employment_id
        );
        await deleteLogExtraByShiftId(req.params.shiftId);
        await updateLogExtras(req.params.shiftId, req.body.extras_ids_string);
        sendRes(res);
    } catch (_e) {
        sendErrorRes(res);
    }
};
export const deleteLogShift = async (req: Request, res: Response) => {
    try {
        const [result] = await readLogShiftByUserIdAndShiftId(
            req.authenticatedUser.id,
            req.params.shiftId
        );
        await deleteLogShiftByUserIdAndShiftId(
            req.authenticatedUser.id,
            req.params.shiftId
        );
        if (result?.from) {
            await updateAffectedShifts(
                req.authenticatedUser.id,
                result?.from,
                result.employment_id.toString()
            );
        }
        sendRes(res);
    } catch (_e) {
        sendErrorRes(res);
    }
};
