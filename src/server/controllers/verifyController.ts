import { sendErrorRes, sendRes } from "../utils/sendRes";
import { Request, Response } from "express";
import {
    deleteVerificationsByUserId,
    readVerificationBySelector,
} from "../crud/verificationCrud";
import { validateHash } from "../utils/crypto";
import { updateUserVerificationById } from "../crud/userCrud";
import { VerificationToken } from "../../../types/commonTypes";

export const getVerify = async (req: Request, res: Response) => {
    try {
        if (
            req.query.selector &&
            typeof req.query.selector === "string" &&
            req.query.token &&
            typeof req.query.token === "string"
        ) {
            const [row] = await readVerificationBySelector(req.query.selector);

            if (!row) {
                //token not found
                sendErrorRes(res, "invalidToken");
            } else {
                const { user_id, hash, salt, expires_at } =
                    row as VerificationToken;
                if (new Date(expires_at) < new Date()) {
                    //token expired
                    sendErrorRes(res, "expiredToken");
                } else if (validateHash(req.query.token, hash, salt)) {
                    //verified
                    await updateUserVerificationById(user_id);
                    await deleteVerificationsByUserId(user_id);
                    //TODO send email
                    sendRes(res, {
                        title: "Account verified",
                        message:
                            "You email address have been verified and you can now log in to your account",
                    });
                } else {
                    //invalid token
                    sendErrorRes(res, "invalidToken");
                }
            }
        } else {
            sendErrorRes(res, "noTokenOrSelector");
        }
    } catch (e) {
        console.log(e);
        sendErrorRes(res);
    }
};
