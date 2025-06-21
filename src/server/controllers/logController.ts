import { Request, Response } from "express";
import mockLogData from "../../../tests/data/mockLogData";
import { sendErrorRes, sendRes } from "../utils/sendRes";

export const getLog = async (_req: Request, res: Response) => {
    await setTimeout(() => true, 1000);
    sendRes(res, {
        title: "Log refreshed",
        message: "Log data refreshed",
        data: [...mockLogData],
    });
};
export const getLogShift = async (req: Request, res: Response) => {
    const shift = mockLogData.find((x) => x.id === req.params.shiftId);
    if (shift) {
        sendRes(res, { data: shift });
    } else {
        sendErrorRes(res);
    }
};
export const postLogShift = async (req: Request, res: Response) => {
    mockLogData.push({ ...req.body });
    sendRes(res);
};
export const patchLogShift = async (req: Request, res: Response) => {
    console.log("Pathcing");
    const index = mockLogData.findIndex((x) => x.id === req.params.shiftId);
    if (!isNaN(index)) {
        mockLogData[index] = { ...req.body };
    }
    sendRes(res);
};
export const deleteLogShift = async (req: Request, res: Response) => {
    const index = mockLogData.findIndex((x) => x.id === req.params.shiftId);
    if (!isNaN(index)) {
        mockLogData.splice(index, 1);
    }
    sendRes(res);
};
