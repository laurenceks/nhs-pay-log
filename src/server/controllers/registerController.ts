import { createUser } from "../crud/userCrud";
import { sendErrorRes, sendRes } from "../utils/sendRes";
import { Request, Response } from "express";
import { readPayBandsForRegistering } from "../crud/payBandCrud";
import {
    createEmployment,
    readEmploymentsByUserId,
} from "../crud/employmentsCrud";
import { createContract } from "../crud/contractCrud";
import { createHashSaltPair } from "../utils/crypto";
import { randomUUID } from "node:crypto";
import sendVerificationEmail from "../email/sendVerificationEmail";

export const getRegisterOptions = async (_req: Request, res: Response) => {
    try {
        const options = await readPayBandsForRegistering();
        sendRes(res, { data: options });
    } catch (_e) {
        sendErrorRes(res);
    }
};
export const postRegister = async (req: Request, res: Response) => {
    //TODO validate passwords match
    const { hash, salt } = createHashSaltPair(req.body.password1);
    try {
        const userId = randomUUID();
        await createUser(userId, req.body.email, hash, salt);
        await createEmployment(userId, req.body.employment_name);
        const [newEmployment] = await readEmploymentsByUserId(userId);

        await createContract(
            userId,
            newEmployment.id,
            req.body.pay_group_id,
            req.body.hca_group_id || null,
            req.body.weekly_hours,
            req.body.pension_perc / 100,
            req.body.student_loan || null
        );
        await sendVerificationEmail(userId, req.body.email);

        sendRes(res, {
            title: "Registration successful",
            message:
                "You have successfully registered your account, please check your inbox for a verification email",
        });
    } catch (e) {
        console.log(e);
        if ((e as { code: string }).code === "ER_DUP_ENTRY") {
            sendErrorRes(res, "userAlreadyRegistered", {
                email: req.body.email,
            });
        } else {
            sendErrorRes(res);
        }
    }
};
