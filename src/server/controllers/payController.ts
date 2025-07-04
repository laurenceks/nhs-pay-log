import { Request, Response } from "express";
import { sendRes } from "../utils/sendRes";
import { readLogByUserIdGroupByPayDate } from "../crud/logCrud";

export const getPay = async (req: Request, res: Response) => {
    const data = await readLogByUserIdGroupByPayDate(req.authenticatedUser.id);
    sendRes(res, {
        title: "Pay refreshed",
        message: "Pay data refreshed",
        data: data,
    });
};
