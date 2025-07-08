import { sendErrorRes, sendRes } from "../utils/sendRes";
import { Request, Response } from "express";
import { createHashSaltPair } from "../utils/crypto";
import { readUserByEmail, updateUserPasswordById } from "../crud/userCrud";
import sendForgotEmail from "../email/sendForgotEmail";
import passport from "passport";
import { ApiUser } from "../../../types/commonTypes";
import { ErrorResponseKey } from "../../../types/responseTypes";
import sendPasswordResetEmail from "../email/sendPasswordResetEmail";
import delay from "../utils/delay";

export const postForgot = async (req: Request, res: Response) => {
    try {
        const [user] = await readUserByEmail(req.body.email);

        await delay(
            !!(user?.id && user?.verified),
            async () => await sendForgotEmail(user?.id, req.body.email)
        );

        sendRes(res, {
            title: "Password reset sent",
            message: "A reset link has been sent to your email",
        });
    } catch (e) {
        console.log(e);
        sendErrorRes(res);
    }
};
export const patchForgot = async (req: Request, res: Response) => {
    try {
        passport.authenticate(
            "local",
            async (error: string | null | { code: string }, user: ApiUser) => {
                try {
                    if (!error && user) {
                        const { hash, salt } = createHashSaltPair(
                            req.body.newPassword1
                        );
                        await updateUserPasswordById(hash, salt, req.userId);
                        await sendPasswordResetEmail(user.email);
                        sendRes(res, {
                            title: "Password reset",
                            message: "Your password has been reset",
                        });
                    } else {
                        if (typeof error === "string") {
                            sendErrorRes(res, error as ErrorResponseKey);
                        } else {
                            if (error?.code === "ECONNREFUSED") {
                                sendErrorRes(res);
                            } else {
                                sendErrorRes(res, "invalidUsernameOrPassword");
                            }
                        }
                    }
                } catch (_e) {
                    sendErrorRes(res);
                }
            }
        )(req, res);
    } catch (_e) {
        sendErrorRes(res);
    }
};
