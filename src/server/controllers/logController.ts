import { Request, Response } from "express";
import { sendErrorRes, sendRes } from "../utils/sendRes";
import {
    createLogShift,
    deleteLogShiftByUserIdAndShiftId,
    readAffectedLogByUserIdAndShiftId,
    readLogByUserId,
    readLogShiftByUserIdAndShiftId,
    updateLogShiftByUserIdAndShiftId,
} from "../crud/logCrud";
import { calculateUsh } from "../../shared/calculations/ush";
import { calculateAdditionalHours } from "../../shared/calculations/additionalHours";

const updateAffectedShifts = async (userId: string, from: string) => {
    const affectedShifts = await readAffectedLogByUserIdAndShiftId(
        userId,
        from
    );

    for (const shift of affectedShifts) {
        const additionalHours = calculateAdditionalHours(shift, affectedShifts);
        await updateLogShiftByUserIdAndShiftId(userId, {
            ...shift,
            ...{
                ...calculateUsh(
                    shift.from,
                    shift.overrun_type === "OT"
                        ? shift.actual_to
                        : shift.planned_to,
                    shift.type,
                    additionalHours.time_and_half + additionalHours.double
                ),
                ...additionalHours,
            },
        });
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
    //TODO FOR ALL log mutations - recalculate additional hours and ush for that week
    try {
        await createLogShift(req.authenticatedUser.id, req.body);
        await updateAffectedShifts(req.authenticatedUser.id, req.body.from);
        sendRes(res);
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
        await updateAffectedShifts(req.authenticatedUser.id, req.body.from);
        sendRes(res);
    } catch (e) {
        console.log(e);
        sendErrorRes(res);
    }
};
export const deleteLogShift = async (req: Request, res: Response) => {
    try {
        const [{ from }] = await readLogShiftByUserIdAndShiftId(
            req.authenticatedUser.id,
            req.params.shiftId
        );
        await deleteLogShiftByUserIdAndShiftId(
            req.authenticatedUser.id,
            req.params.shiftId
        );
        if (from) {
            await updateAffectedShifts(req.authenticatedUser.id, from);
        }
        sendRes(res);
    } catch (e) {
        console.log(e);
        sendErrorRes(res);
    }
};
