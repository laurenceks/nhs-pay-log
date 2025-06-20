import { sendErrorRes, sendRes } from "../utils/sendRes";
import passport from "passport";
import logoutAndDestroySession from "../utils/logoutAndDestroySession";
import { AppUser } from "../../../types/commonTypes";
import { ErrorResponseKey } from "../../../types/responseTypes";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        req.logout(() => {});
    }
    try {
        passport.authenticate(
            "local",
            (error: string | null, user: AppUser) => {
                try {
                    if (!error && user) {
                        req.login(user, async (e) => {
                            if (e) {
                                console.log(e);
                                logoutAndDestroySession(req, res);
                                sendErrorRes(res, "unauthorised");
                            }
                            sendRes<AppUser>(res, {
                                data: user,
                            });
                        });
                    } else {
                        logoutAndDestroySession(req, res);
                        if (typeof error === "string") {
                            sendErrorRes(res, error as ErrorResponseKey);
                        } else {
                            sendErrorRes(res, "unauthorised");
                        }
                    }
                } catch (_e) {
                    logoutAndDestroySession(req, res);
                }
            }
        )(req, res);
    } catch (_e) {
        logoutAndDestroySession(req, res);
        sendErrorRes(res);
    }
};

export const checkLoginStatus = async (req: Request, res: Response) => {
    // if user made it to here, then their login credentials are valid
    sendRes<AppUser>(res, { data: req.authenticatedUser });
};
