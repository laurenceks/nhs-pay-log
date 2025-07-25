import { sendErrorRes, sendRes } from "../utils/sendRes";
import { Request, Response } from "express";
import {
    createEmployment,
    deleteEmploymentByUserIdAndEmploymentId,
    readEmploymentsByUserId,
    updateEmploymentByUserIdAndEmploymentId,
} from "../crud/employmentCrud";
import {
    createContract,
    deleteContractsByEmploymentAndUserId,
    readContractsByUserId,
    readLatestContractPayGroupIdByUserId,
} from "../crud/contractCrud";
import { Contract } from "../../../types/commonTypes";
import {
    readOrphanedLogByUserIdAndEmploymentId,
    readOrphanedLogByUserIdAndEmploymentIdAndNewFromOrTo,
    updateOrphanedLogShiftByUserIdAndFormerEmploymentID,
} from "../crud/logCrud";
import allowFirstFromAndLastTo from "../../client/src/reducers/allowFirstFromAndLastTo";

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
export const postEmployment = async (req: Request, res: Response) => {
    try {
        const { insertId } = await createEmployment(
            req.authenticatedUser.id,
            "My job"
        );
        const [{ pay_group_id }] = await readLatestContractPayGroupIdByUserId(
            req.authenticatedUser.id
        );
        await createContract(
            req.authenticatedUser.id,
            insertId,
            pay_group_id,
            null,
            0,
            0,
            null,
            0
        );
        sendRes(res, {
            title: "Employment saved",
            message: "Employment saved",
        });
    } catch (_e) {
        sendErrorRes(res);
    }
};
export const patchEmployment = async (req: Request, res: Response) => {
    try {
        let orphanedShifts = [];
        if (
            !!req.body.contracts[0]?.from ||
            !!req.body.contracts[req.body.contracts.length - 1]?.to
        ) {
            //make sure no shifts will be orphaned by setting the from/to of the employment
            orphanedShifts =
                await readOrphanedLogByUserIdAndEmploymentIdAndNewFromOrTo(
                    req.authenticatedUser.id,
                    req.params.employmentId,
                    req.body.contracts[0]?.from,
                    req.body.contracts[req.body.contracts.length - 1]?.to
                );
        }

        if (orphanedShifts.length) {
            sendErrorRes(res, null, {
                title: "Invalid date range",
                message: `${orphanedShifts.length} shifts from this employment fall outside its date range`,
            });
        } else {
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
        }
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
export const deleteEmployment = async (req: Request, res: Response) => {
    try {
        //TODO first check if there are other employments with no start or end to make safe the deletion
        //TODO THEN update each shift with a new employment ID
        //TODO THEN delete all contracts with employment ID
        //TODO THEN delete delete employment
        const employments = await readEmploymentsByUserId(
            req.authenticatedUser.id
        );
        const contracts = await readContractsByUserId(req.authenticatedUser.id);
        if (employments.length <= 1) {
            sendErrorRes(res, null, {
                title: "Unable to delete",
                message: `You must have at least one employment`,
            });
        } else {
            const { allowFirstFrom, allowLastTo } = allowFirstFromAndLastTo(
                Number(req.params.employmentId),
                contracts
            );

            if (allowFirstFrom && allowLastTo) {
                await updateOrphanedLogShiftByUserIdAndFormerEmploymentID(
                    req.authenticatedUser.id,
                    req.params.employmentId
                );
                const orphanedShifts =
                    await readOrphanedLogByUserIdAndEmploymentId(
                        req.authenticatedUser.id,
                        req.params.employmentId
                    );
                if (orphanedShifts.length) {
                    sendErrorRes(res, null, {
                        title: "Unable to delete",
                        message: `${orphanedShifts.length} shifts from this employment could not be transferred to other employments`,
                    });
                } else {
                    await deleteContractsByEmploymentAndUserId(
                        req.authenticatedUser.id,
                        req.params.employmentId
                    );
                    await deleteEmploymentByUserIdAndEmploymentId(
                        req.authenticatedUser.id,
                        req.params.employmentId
                    );
                    sendRes(res, {
                        title: "Employment deleted",
                        message: `Employment deleted`,
                    });
                }
            } else {
                //there isn't another employment with a null from/to
                sendErrorRes(res, "validationError", {
                    title: "Unable to delete",
                    message:
                        "At least one employment must have one contract with no from and no to",
                });
            }
        }
    } catch (e) {
        console.log(e);
        sendErrorRes(res);
    }
};
