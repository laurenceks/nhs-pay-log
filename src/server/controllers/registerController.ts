import { createUser, readUserByEmail } from "../crud/userCrud";
import { createHashSaltPair } from "../utils/crypto";
import { sendErrorRes, sendRes } from "../utils/sendRes";
import { Request, Response } from "express";
import { readPayBandsForRegistering } from "../crud/payBandsCrud";
import {
    createEmployment,
    readEmploymentsByUserId,
} from "../crud/employmentsCrud";
import { createContract } from "../crud/contractCrud";

export const getRegisterOptions = async (_req: Request, res: Response) => {
    try {
        const options = await readPayBandsForRegistering();
        sendRes(res, { data: options });
    } catch (_e) {
        sendErrorRes(res);
    }
};
export const postRegister = async (req: Request, res: Response) => {
    const { hash, salt } = createHashSaltPair("password", req.body.password1);
    try {
        await createUser(req.body.email, hash, salt);
        const [newUser] = await readUserByEmail(req.body.email);
        await createEmployment(
            newUser.id,
            req.body.employment_from,
            req.body.employment_name
        );
        const [newEmployment] = await readEmploymentsByUserId(newUser.id);
        await createContract(
            newUser.id,
            req.body.employment_from,
            newEmployment.id,
            req.body.pay_group_id,
            req.body.contract_name,
            req.body.weekly_hours
        );
        sendRes(res, {
            title: "Registration successful",
            message:
                "You have successfully registered your account and can now login",
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
