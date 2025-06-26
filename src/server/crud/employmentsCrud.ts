import { executeByArray, executeByPlaceholders } from "../utils/db";

export const createEmployment = async (
    userId: string,
    from: string,
    payGroupId: string,
    name: string,
    weeklyHours: number
) => {
    return await executeByPlaceholders(
        "INSERT INTO `employments` (`user_id`, `from`, `pay_group_id`, `name`, `weekly_hours`) VALUES (:userId, :from, :payGroupId, :name, :weeklyHours)",
        { userId, from, payGroupId, name, weeklyHours }
    );
};

export const readEmploymentsByUserId = async (userId: string) => {
    return await executeByArray(
        "SELECT `id`, `name`, `from`, `to`, `weekly_hours`, `pay_group_id` FROM `employments` WHERE `user_id` = ? ORDER BY `from`, `to`, `name`",
        [userId]
    );
};
