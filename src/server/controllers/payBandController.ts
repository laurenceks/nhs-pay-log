import { sendErrorRes, sendRes } from "../utils/sendRes";
import { Request, Response } from "express";
import { readPayBands } from "../crud/payBandCrud";

export const getPayBands = async (req: Request, res: Response) => {
    try {
        const payBands = await readPayBands(req.authenticatedUser.id);
        sendRes(res, { data: payBands });
    } catch (_e) {
        sendErrorRes(res);
    }
};
