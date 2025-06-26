import { sendErrorRes, sendRes } from "../utils/sendRes";
import { Request, Response } from "express";
import { readContractsByUserId } from "../crud/contractCrud";

export const getContracts = async (req: Request, res: Response) => {
    try {
        const contracts = await readContractsByUserId(req.authenticatedUser.id);
        sendRes(res, { data: contracts });
    } catch (_e) {
        sendErrorRes(res);
    }
};
