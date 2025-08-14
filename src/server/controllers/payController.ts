import { Request, Response } from "express";
import { sendRes } from "../utils/sendRes";
import {
    readPayByUserId,
    readPayslipByUserIdEmployerIdAndPayMonth,
} from "../crud/payCrud";

export const getPay = async (req: Request, res: Response) => {
    const data = await readPayByUserId(req.authenticatedUser.id);
    sendRes(res, {
        title: "Pay refreshed",
        message: "Pay data refreshed",
        data: data,
    });
};
export const getPaySlip = async (req: Request, res: Response) => {
    const data = await readPayslipByUserIdEmployerIdAndPayMonth(
        req.authenticatedUser.id,
        req.params.employmentId,
        req.params.payMonth
    );
    sendRes(res, {
        title: "Payslip refreshed",
        message: "Payslip data refreshed",
        data: data,
    });
};
