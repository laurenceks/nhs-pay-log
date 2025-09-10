import {
    executeReadByArray,
    executeReadByPlaceholders,
    executeWriteByArray,
    executeWriteByPlaceholders,
} from "../utils/db";
import { Contract } from "../../../types/commonTypes";

export const createContract = async (
    userId: string | number,
    employmentId: string | number,
    payGroupId: Contract["pay_group_id"],
    hcaGroupId: Contract["hca_group_id"],
    weeklyHours: Contract["weekly_hours"],
    pensionPerc: Contract["pension_perc"],
    studentLoan: Contract["student_loan"],
    personalAllowance: Contract["personal_allowance"],
    from: Contract["from"] = null,
    to: Contract["to"] = null,
    halfIsAllUsh: 0 | 1 = 1,
    breakFromHigher: 0 | 1 = 0
) => {
    return await executeWriteByPlaceholders(
        "INSERT INTO `contracts` (`user_id`,\n                         `employment_id`,\n                         `from`,\n                         `to`,\n                         `pay_group_id`,\n                         `hca_group_id`,\n                         `weekly_hours`,\n                         `pension_perc`,\n                         `student_loan`,\n                         `personal_allowance`,\n                         `half_is_all_ush`,\n                         `break_from_higher`)\nVALUES (:userId,\n        :employmentId,\n        :from,\n        :to,\n        :payGroupId,\n        :hcaGroupId,\n        :weeklyHours,\n        :pensionPerc,\n        :studentLoan,\n        :personalAllowance,\n        :halfIsAllUsh,\n        :breakFromHigher)",
        {
            userId,
            employmentId,
            from,
            to,
            payGroupId,
            hcaGroupId,
            weeklyHours,
            pensionPerc,
            studentLoan,
            personalAllowance,
            halfIsAllUsh,
            breakFromHigher,
        }
    );
};

export const readContractsByUserId = async (userId: string) => {
    return await executeReadByArray<Contract>(
        "SELECT `contracts`.`id`,\n       `contracts`.`employment_id`,\n       `employments`.`name` AS `employment_name`,\n       `contracts`.`from`,\n       `contracts`.`to`,\n       `weekly_hours`,\n       `pay_group_id`,\n       `pension_perc`,\n       `personal_allowance`,\n       `student_loan`,\n       `hca_group_id`,\n       `half_is_all_ush`,\n       `break_from_higher`\nFROM `contracts`\n         INNER JOIN `employments` ON `employments`.`id` = `contracts`.`employment_id` AND\n                                    `employments`.`user_id` = `contracts`.`user_id`\nWHERE `contracts`.`user_id` = ?\nORDER BY `contracts`.`from`, `contracts`.`to`, `employment_name`",
        [userId]
    );
};
export const readContractsByUserIdAndEmploymentId = async (
    userId: string,
    employmentId: string | number
) => {
    return await executeReadByPlaceholders<Contract>(
        "SELECT `contracts`.`id`,\n       `contracts`.`employment_id`,\n       `employments`.`name` AS `employment_name`,\n       `contracts`.`from`,\n       `contracts`.`to`,\n       `weekly_hours`,\n       `pay_group_id`,\n       `pension_perc`,\n       `personal_allowance`,\n       `student_loan`,\n       `hca_group_id`,\n       `half_is_all_ush`,\n       `break_from_higher`\nFROM `contracts`\n         INNER JOIN `employments` ON `employments`.`id` = `contracts`.`employment_id` AND\n                                     `employments`.`user_id` = `contracts`.`user_id`\nWHERE `contracts`.`user_id` = :userId AND `contracts`.`employment_id` = :employmentId\nORDER BY `contracts`.`from`, `contracts`.`to`, `employment_name`",
        { userId, employmentId }
    );
};
export const readContractsByUserIdAndNotEmploymentId = async (
    userId: string,
    employmentId: string | number
) => {
    return await executeReadByPlaceholders<Contract>(
        "SELECT `contracts`.`id`,\n       `contracts`.`employment_id`,\n       `employments`.`name` AS `employment_name`,\n       `contracts`.`from`,\n       `contracts`.`to`,\n       `weekly_hours`,\n       `pay_group_id`,\n       `pension_perc`,\n       `personal_allowance`,\n       `student_loan`,\n       `hca_group_id`,\n       `half_is_all_ush`,\n       `break_from_higher`\nFROM `contracts`\n         INNER JOIN `employments` ON `employments`.`id` = `contracts`.`employment_id` AND\n                                     `employments`.`user_id` = `contracts`.`user_id`\nWHERE `contracts`.`user_id` = :userId AND `contracts`.`employment_id` != :employmentId\nORDER BY `contracts`.`from`, `contracts`.`to`, `employment_name`",
        { userId, employmentId }
    );
};

export const readLatestContractPayGroupIdByUserId = async (userId: string) => {
    return await executeReadByArray<Contract>(
        "SELECT `contracts`.`pay_group_id`\nFROM `contracts`\nWHERE `contracts`.`user_id` = ?\nORDER BY `contracts`.`to` iS NULL DESC, `contracts`.`to` DESC\nLIMIT 1",
        [userId]
    );
};

export const deleteContractsByEmploymentAndUserId = async (
    userId: string,
    employmentId: string | number
) => {
    return await executeWriteByArray(
        "DELETE FROM `contracts` WHERE `user_id` = ? AND `employment_id` = ?",
        [userId, employmentId]
    );
};
