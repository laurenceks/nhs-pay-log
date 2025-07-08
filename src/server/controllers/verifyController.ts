import { sendErrorRes, sendRes } from "../utils/sendRes";
import { Request, Response } from "express";
import { deleteSecurityTokensByUserId } from "../crud/securityTokenCrud";
import { readUserByEmail, updateUserVerificationById } from "../crud/userCrud";
import sendVerificationEmail from "../email/sendVerificationEmail";
import delay from "../utils/delay";

export const getVerify = async (req: Request, res: Response) => {
    try {
        await updateUserVerificationById(req.userId);
        await deleteSecurityTokensByUserId(req.userId);
        //TODO pretty email
        sendRes(res, {
            title: "Account verified",
            message:
                "You email address have been verified and you can now log in to your account",
        });
    } catch (e) {
        console.log(e);
        sendErrorRes(res);
    }
};
export const postVerify = async (req: Request, res: Response) => {
    //resend verification link
    try {
        const [user] = await readUserByEmail(req.body.email);
        await delay(
            !!user?.id,
            async () => await sendVerificationEmail(user?.id, req.body.email)
        );
        sendRes(res, { message: "Verification link sent" });
    } catch (e) {
        console.log(e);
        sendErrorRes(res);
    }
};
