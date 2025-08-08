import { Request, Response } from "express";
import { sendErrorRes, sendRes } from "../utils/sendRes";
import {
    createLogShift,
    deleteLogShiftByUserIdAndShiftId,
    readAffectedLogByUserIdAndShiftId,
    readLogByUserId,
    readLogShiftByUserIdAndShiftId,
    readUshAverageLogByUserIdAndEmploymentId,
    updateLogShiftByUserIdAndShiftId,
} from "../crud/logCrud";
import { calculateUsh } from "../../shared/calculations/ush";
import { calculateAdditionalHours } from "../../shared/calculations/additionalHours";
import { createLogExtra, deleteLogExtraByShiftId } from "../crud/logExtraCrud";
import { decimalHoursToMs } from "../../shared/utils/conversions";

const updateAffectedShifts = async (
    userId: string,
    from: string,
    employmentId: string
) => {
    const affectedShifts = await readAffectedLogByUserIdAndShiftId(
        userId,
        from,
        employmentId
    );
    for (const shift of affectedShifts) {
        const additionalHours = calculateAdditionalHours(shift, affectedShifts);
        const log =
            shift.type === "AL (relief)" ||
            shift.type === "Absent (TOIL relief)"
                ? await readUshAverageLogByUserIdAndEmploymentId(
                      userId,
                      from,
                      employmentId
                  )
                : [];

        await updateLogShiftByUserIdAndShiftId(userId, {
            ...shift,
            ...{
                ...calculateUsh(
                    shift.from,
                    shift.overrun_type === "OT"
                        ? shift.actual_to
                        : shift.planned_to,
                    shift.type,
                    additionalHours.time_and_half + additionalHours.double,
                    decimalHoursToMs(shift.weekly_hours),
                    log
                ),
                ...additionalHours,
            },
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
    } catch (e) {
        console.log(e);
        sendErrorRes(res);
    }
};
export const patchLogShift = async (req: Request, res: Response) => {
    try {
        await updateLogShiftByUserIdAndShiftId(
            req.authenticatedUser.id,
            req.body
        );
        await updateAffectedShifts(
            req.authenticatedUser.id,
            req.body.from,
            req.body.employment_id
        );
        await deleteLogExtraByShiftId(req.params.shiftId);
        await updateLogExtras(req.params.shiftId, req.body.extras_ids_string);
        sendRes(res);
    } catch (e) {
        console.log(e);
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
    } catch (e) {
        console.log(e);
        sendErrorRes(res);
    }
};
