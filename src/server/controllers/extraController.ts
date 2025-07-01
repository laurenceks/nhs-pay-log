import { sendErrorRes, sendRes } from "../utils/sendRes";
import { Request, Response } from "express";
import { readExtrasByUserId } from "../crud/extraCrud";

export const getExtras = async (req: Request, res: Response) => {
    try {
        const extras = await readExtrasByUserId(req.authenticatedUser.id);
        sendRes(res, { data: extras });
    } catch (_e) {
        sendErrorRes(res);
    }
};
