import { executeReadByArray, executeWriteByPlaceholders } from "../utils/db";

export const createEmployment = async (
    userId: string | number,
    from: string,
    name: string
) => {
    return await executeWriteByPlaceholders(
        "INSERT INTO `employments` (`user_id`, `from`, `name`) VALUES (:userId, :from, :name)",
        { userId, from, name }
    );
};

export const readEmploymentsByUserId = async (userId: string | number) => {
    return await executeReadByArray(
        "SELECT `id`, `name`, `from`, `to` FROM `employments` WHERE `user_id` = ? ORDER BY `from`, `to`, `name`",
        [userId]
    );
};
