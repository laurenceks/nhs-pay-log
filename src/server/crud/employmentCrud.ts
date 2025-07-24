import { executeReadByArray, executeWriteByPlaceholders } from "../utils/db";

export const createEmployment = async (
    userId: string | number,
    name: string
) => {
    return await executeWriteByPlaceholders(
        "INSERT INTO `employments` (`user_id`, `name`) VALUES (:userId, :name)",
        { userId, name }
    );
};

export const readEmploymentsByUserId = async (userId: string | number) => {
    return await executeReadByArray(
        "SELECT `employments`.`id`,\n       `employments`.`name`\nFROM `employments`\n         LEFT JOIN\n     `contracts`\n     ON `contracts`.`employment_id` = `employments`.`id`\n         AND `contracts`.`user_id` = `employments`.`user_id`\nWHERE `employments`.`user_id` = ?\nGROUP BY `employments`.`id`,\n         `employments`.`name`\nORDER BY MIN(IF(`contracts`.`from` IS NULL, 0, `contracts`.`from`)),\n         `employments`.`name`;",
        [userId]
    );
};
export const readEmploymentByUserIdAndEmploymentId = async (
    userId: string | number,
    employmentId: string | number
) => {
    return await executeReadByArray(
        "SELECT * FROM `employments` WHERE `user_id` = ? AND `id` = ?;",
        [userId, employmentId]
    );
};
export const updateEmploymentByUserIdAndEmploymentId = async (
    userId: string | number,
    employmentId: string | number,
    name: string
) => {
    return await executeReadByArray(
        "UPDATE `employments` SET `name` = ? WHERE `user_id` = ? AND `id` = ?;",
        [name, userId, employmentId]
    );
};
