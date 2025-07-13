import { sendErrorRes, sendRes } from "../utils/sendRes";
import passport from "passport";
import logoutAndDestroySession from "../utils/logoutAndDestroySession";
import { ApiUser, ClientUser } from "../../../types/commonTypes";
import { ErrorResponseKey } from "../../../types/responseTypes";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

export const login = async (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        req.logout(() => {});
    }
    try {
        const result = validationResult(req);
        if (result.isEmpty()) {
            passport.authenticate(
                "local",
                (error: string | null | { code: string }, user: ApiUser) => {
                    try {
                        if (!error && user) {
                            req.login(user, async (e) => {
                                if (e) {
                                    logoutAndDestroySession(req, res);
                                    sendErrorRes(res, "unauthorised");
                                } else {
                                    sendRes<ClientUser>(res, {
                                        data: {
                                            id: user.id,
                                            email: user.email,
                                        },
                                    });
                                }
                            });
                        } else {
                            logoutAndDestroySession(req, res);
                            if (typeof error === "string") {
                                sendErrorRes(res, error as ErrorResponseKey);
                            } else {
                                if (error?.code === "ECONNREFUSED") {
                                    sendErrorRes(res);
                                } else {
                                    sendErrorRes(res, "unauthorised");
                                }
                            }
                        }
                    } catch (_e) {
                        logoutAndDestroySession(req, res);
                        sendErrorRes(res);
                    }
                }
            )(req, res);
        } else {
            sendErrorRes(res, "invalidUsernameOrPassword");
        }
    } catch (_e) {
        logoutAndDestroySession(req, res);
        sendErrorRes(res);
    }
};

export const checkLoginStatus = async (req: Request, res: Response) => {
    // if user made it to here, then their login credentials are valid
    sendRes<ClientUser>(res, {
        data: {
            id: req.authenticatedUser.id,
            email: req.authenticatedUser.email,
        },
    });
};
