import { sendRes } from "./sendRes";
import { Request, Response } from "express";

const logoutAndDestroySession = (
    req: Request,
    res: Response,
    send500OnError = false
) => {
    // logs out current user, destroys session and clears sid cookie
    res.clearCookie("sid");
    res.clearCookie("sessionExpiry");
    req.logout((_e) => {
        if (send500OnError) {
            sendRes(res, { code: 500 });
        }
    });
    if (req.session) {
        req.session.destroy((e) => {
            console.log(e);
        });
    }
};

export default logoutAndDestroySession;
