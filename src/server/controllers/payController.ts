import { Request, Response } from "express";
import { sendRes } from "../utils/sendRes";
import { readPayByUserId } from "../crud/payCrud";

export const getPay = async (req: Request, res: Response) => {
    const data = await readPayByUserId(req.authenticatedUser.id);
    sendRes(res, {
        title: "Pay refreshed",
        message: "Pay data refreshed",
        data: data,
    });
};
