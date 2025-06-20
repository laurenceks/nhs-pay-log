import { createUser } from "../crud/userCrud";
import { createHashSaltPair } from "../utils/crypto";
import { sendErrorRes, sendRes } from "../utils/sendRes";
import { Request, Response } from "express";

const registerController = async (req: Request, res: Response) => {
    const { hash, salt } = createHashSaltPair("password", req.body.password1);
    try {
        await createUser(req.body.email, hash, salt);
        sendRes(res, {
            title: "Registration successful",
            message:
                "You have successfully registered your account and can now login",
        });
    } catch (e) {
        if ((e as { code: string }).code === "ER_DUP_ENTRY") {
            sendErrorRes(res, "userAlreadyRegistered");
        } else {
            sendErrorRes(res);
        }
    }
};

export default registerController;
