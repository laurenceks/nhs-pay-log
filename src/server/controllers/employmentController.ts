import { sendErrorRes, sendRes } from "../utils/sendRes";
import { Request, Response } from "express";
import {
    readEmploymentsByUserId,
    updateEmploymentByUserIdAndEmploymentId,
} from "../crud/employmentCrud";
import {
    createContract,
    deleteContractsByEmploymentAndUserId,
} from "../crud/contractCrud";
import { Contract } from "../../../types/commonTypes";

export const getEmployments = async (req: Request, res: Response) => {
    try {
        const employments = await readEmploymentsByUserId(
            req.authenticatedUser.id
        );
        sendRes(res, { data: employments });
    } catch (_e) {
        sendErrorRes(res);
    }
};
export const patchEmployment = async (req: Request, res: Response) => {
    try {
        await deleteContractsByEmploymentAndUserId(
            req.authenticatedUser.id,
            req.params.employmentId
        );
        await updateEmploymentByUserIdAndEmploymentId(
            req.authenticatedUser.id,
            req.params.employmentId,
            req.body.name
        );
        for (const contract of req.body.contracts as Contract[]) {
            await createContract(
                req.authenticatedUser.id,
                req.params.employmentId,
                contract.pay_group_id,
                contract.hca_group_id,
                contract.weekly_hours,
                contract.pension_perc,
                contract.student_loan,
                contract.personal_allowance,
                contract.from,
                contract.to
            );
        }
        sendRes(res, {
            title: "Employment saved",
            message: `${req.body.name} saved`,
        });
    } catch (e) {
        if ((e as { code: string }).code === "ER_NO_REFERENCED_ROW_2") {
            sendErrorRes(res, null, {
                title: "Unknown employment ID",
                message: "The given employment does not exist",
            });
        } else {
            sendErrorRes(res);
        }
    }
};
