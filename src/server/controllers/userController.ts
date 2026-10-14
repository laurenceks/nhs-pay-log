import { updateUserDetails } from "../crud/userCrud";
import { sendErrorRes, sendRes } from "../utils/sendRes";
import { Request, Response } from "express";

export const patchUser = async (req: Request, res: Response) => {
    try {
        await updateUserDetails(
            req.authenticatedUser.id,
            req.body.first_name,
            req.body.last_name
        );

        sendRes(res, {
            title: "User details updated",
            message: "You have successfully updated your details",
        });
    } catch (e) {
        console.log(e);
        sendErrorRes(res);
    }
};
