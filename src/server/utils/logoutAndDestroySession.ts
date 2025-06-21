import { sendRes } from "./sendRes";
import { Request, Response } from "express";

const logoutAndDestroySession = (
    req: Request,
    res: Response,
    send500OnError = false
) => {
    // logs out current user, destroys session and clears sid cookie
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
    res.clearCookie("sid");
};

export default logoutAndDestroySession;
