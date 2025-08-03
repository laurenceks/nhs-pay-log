import { sendRes } from "./sendRes";
import { Request, Response } from "express";

const logoutAndDestroySession = (
    req: Request,
    res: Response,
    send500OnError = false
) => {
    // logs out current user, destroys session and clears cookies
    res.clearCookie("sessionExpiry");
    res.clearCookie("connect.sid", {
        secure: !!req.session.cookie.secure,
        httpOnly: true,
        path: req.session.cookie.path,
        domain: req.session.cookie.domain,
    });
    req.logout((_e) => {
        if (send500OnError) {
            sendRes(res, { code: 500 });
        }
    });
    if (req.session) {
        req.session.destroy((e) => {
            if (e instanceof Error) {
                console.log(e);
            }
        });
    }
};

export default logoutAndDestroySession;
