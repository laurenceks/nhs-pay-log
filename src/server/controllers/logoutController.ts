import { sendErrorRes, sendRes } from "../utils/sendRes";
import logoutAndDestroySession from "../utils/logoutAndDestroySession";
import { Request, Response } from "express";

export const logout = async (req: Request, res: Response) => {
    try {
        logoutAndDestroySession(req, res);
        sendRes(res, {
            title: "Logged out",
            message: "You have been logged out",
        });
    } catch (_e) {
        logoutAndDestroySession(req, res);
        sendErrorRes(res);
    }
};
