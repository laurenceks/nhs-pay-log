import {
    deleteExpiredSecurityTokensByUserId,
    readSecurityTokenBySelector,
} from "../crud/securityTokenCrud";
import { sendErrorRes } from "../utils/sendRes";
import { VerificationToken } from "../../../types/commonTypes";
import { validateHash } from "../utils/crypto";
import { NextFunction, Request, Response } from "express";

const validateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (
            req.query.selector &&
            typeof req.query.selector === "string" &&
            req.query.token &&
            typeof req.query.token === "string"
        ) {
            const [row] = await readSecurityTokenBySelector(req.query.selector);
            if (!row) {
                //token not found
                sendErrorRes(res, "invalidToken");
            } else {
                const { user_id, hash, salt, expires_at } =
                    row as VerificationToken;
                await deleteExpiredSecurityTokensByUserId(user_id);
                if (new Date(expires_at) < new Date()) {
                    //token expired
                    sendErrorRes(res, "expiredToken");
                } else if (validateHash(req.query.token, hash, salt)) {
                    //verified
                    req.userId = user_id;
                    next();
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

export default validateToken;
