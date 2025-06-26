import { sendErrorRes, sendRes } from "../utils/sendRes";
import { Request, Response } from "express";
import { readEmploymentsByUserId } from "../crud/employmentsCrud";

export const getEmployments = async (req: Request, res: Response) => {
    try {
        const employments = await readEmploymentsByUserId(
            req.authenticatedUser.id
        );
        sendRes(res, { data: employments });
    } catch (_e) {
        sendErrorRes(res);
    }
};
