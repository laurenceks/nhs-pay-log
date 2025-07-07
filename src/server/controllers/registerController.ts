import { createUser } from "../crud/userCrud";
import { sendErrorRes, sendRes } from "../utils/sendRes";
import { Request, Response } from "express";
import { readPayBandsForRegistering } from "../crud/payBandCrud";
import {
    createEmployment,
    readEmploymentsByUserId,
} from "../crud/employmentsCrud";
import { createContract } from "../crud/contractCrud";
import { createHashSaltPair, createTokenSelector } from "../utils/crypto";
import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";

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
        await createEmployment(
            userId,
            req.body.employment_from,
            req.body.employment_name
        );
        const [newEmployment] = await readEmploymentsByUserId(userId);

        await createContract(
            userId,
            req.body.employment_from,
            newEmployment.id,
            req.body.pay_group_id,
            req.body.contract_name,
            req.body.weekly_hours
        );

        const { url } = await createTokenSelector(userId);

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.NODE_ENV !== "development",
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        await transporter.sendMail({
            to: req.body.email,
            from: `"NHS Pay Log <no-reply@${process.env.DOMAIN}`,
            subject: "Verify your email address",
            text: `Copy and past the link into your browser to get started

${url}`,
            html: `<p>Thank you for signing up to use NHS Pay Log. Please click the link below to verify your email address:</p><p><a href="${url}">Verify</a></p>`,
        });

        sendRes(res, {
            title: "Registration successful",
            message:
                "You have successfully registered your account, please check your inbox for a verification email",
        });
    } catch (e) {
        console.log(e);
        if ((e as { code: string }).code === "ER_DUP_ENTRY") {
            sendErrorRes(res, "userAlreadyRegistered");
        } else {
            sendErrorRes(res);
        }
    }
};
