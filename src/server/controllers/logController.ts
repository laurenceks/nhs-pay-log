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
import { calculateUsh } from "../../shared/calculations/ush";
import { calculateAdditionalHours } from "../../shared/calculations/additionalHours";
import { createLogExtra, deleteLogExtraByShiftId } from "../crud/logExtraCrud";
import { decimalHoursToMs } from "../../shared/utils/conversions";
import {
    calculateSection2,
    LeaveReliefUsh,
} from "../../shared/calculations/section2";

const leaveOnReliefUshWeeksMap: { [key in LeaveReliefUsh]: 0 | 13 | 52 } = {
    average13: 13,
    average52: 52,
    best: 52,
    flat: 0,
    none: 0,
};

const updateAffectedShifts = async (
    userId: string,
    from: string,
    employmentId: string | number
) => {
    //TODO - needs to also select shifts from previously selected employment if its changing
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
                weeklyHoursMs: decimalHoursToMs(shift.weekly_hours),
                breakOverrideMs: shift.break_override,
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
                ...calculateUsh(
                    new Date(shift.from),
                    shift.overrun_type === "OT"
                        ? new Date(shift.actual_to)
                        : new Date(shift.planned_to),
                    shift.type,
                    additionalHours.time_and_half + additionalHours.double,
                    decimalHoursToMs(shift.weekly_hours),
                    shift.break_override,
                    log,
                    !!shift.half_is_all_ush,
                    !!shift.break_from_higher,
                    shift.overrun_type,
                    new Date(shift.actual_to)
                ),
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
        await updateLogShiftByUserIdAndShiftId(userId, {
            ...shift,
            ...calculateSection2(
                { ...shift, log: employmentShifts },
                {
                    weeklyHoursMs: decimalHoursToMs(shift.weekly_hours),
                    breakInHigherRate: !!shift.break_from_higher,
                    halfIsAllUsh: !!shift.half_is_all_ush,
                    leaveReliefUshType: shift.leave_relief_ush_type,
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
