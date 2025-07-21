import {
    executeReadByPlaceholders,
    executeWriteByPlaceholders,
} from "../utils/db";
import { ApiPay } from "../../../types/commonTypes";

export const createContract = async (
    userId: string | number,
    employmentId: string,
    payGroupId: string,
    hcaGroupId: number | null,
    weeklyHours: number,
    pensionPerc: number,
    studentLoan: ApiPay["student_loan"]
) => {
    return await executeWriteByPlaceholders(
        "INSERT INTO `contracts` (`user_id`, `employment_id`, `pay_group_id`, `hca_group_id`, `weekly_hours`, `pension_perc`, `student_loan`) VALUES (:userId, :employmentId, :payGroupId, :hcaGroupId, :weeklyHours, :pensionPerc, :studentLoan)",
        {
            userId,
            employmentId,
            payGroupId,
            hcaGroupId,
            weeklyHours,
            pensionPerc,
            studentLoan,
        }
    );
};

export const readContractsByUserId = async (userId: string) => {
    return await executeReadByPlaceholders(
        "SELECT `c`.`id`, `c`.`employment_id`, `employments`.`name` AS `employment_name`, `c`.`from`, `c`.`to`, `weekly_hours`, `pay_group_id`, `pension_perc`, `personal_allowance`, `student_loan`, `hca_group_id` FROM `contracts` AS `c` LEFT JOIN `employments` ON `c`.`employment_id` = `employments`.`id` WHERE `c`.`user_id` = :userId AND `employments`.`user_id` = :userId ORDER BY `c`.`from`, `c`.`to`, `employment_name`",
        { userId }
    );
};
