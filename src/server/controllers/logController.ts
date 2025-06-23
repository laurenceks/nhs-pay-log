import { Request, Response } from "express";
import { sendErrorRes, sendRes } from "../utils/sendRes";
import {
    createLogShift,
    deleteLogShiftByUserIdAndShiftId,
    readLogByUserId,
    readLogShiftByUserIdAndShiftId,
    updateLogShiftByUserIdAndShiftId,
} from "../crud/logCrud";

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
    console.log(data);
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
        sendRes(res);
    } catch (e) {
        console.log(e);
        sendErrorRes(res);
    }
};
export const deleteLogShift = async (req: Request, res: Response) => {
    try {
        await deleteLogShiftByUserIdAndShiftId(
            req.authenticatedUser.id,
            req.params.shiftId
        );
        sendRes(res);
    } catch (e) {
        console.log(e);
        sendErrorRes(res);
    }
};
