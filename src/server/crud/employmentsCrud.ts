import { executeByArray, executeByPlaceholders } from "../utils/db";

export const createEmployment = async (
    userId: string,
    from: string,
    name: string
) => {
    return await executeByPlaceholders(
        "INSERT INTO `employments` (`user_id`, `from`, `name`) VALUES (:userId, :from, :name)",
        { userId, from, name }
    );
};

export const readEmploymentsByUserId = async (userId: string) => {
    return await executeByArray(
        "SELECT `id`, `name`, `from`, `to` FROM `employments` WHERE `user_id` = ? ORDER BY `from`, `to`, `name`",
        [userId]
    );
};
