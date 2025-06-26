import { executeByPlaceholders } from "../utils/db";

export const createContract = async (
    userId: string,
    from: string,
    employmentId: string,
    payGroupId: string,
    name: string,
    weeklyHours: number
) => {
    return await executeByPlaceholders(
        "INSERT INTO `contracts` (`user_id`, `employment_id`, `from`, `pay_group_id`, `name`, `weekly_hours`) VALUES (:userId, :employmentId, :from, :payGroupId, :name, :weeklyHours)",
        { userId, from, employmentId, payGroupId, name, weeklyHours }
    );
};

export const readContractsByUserId = async (userId: string) => {
    return await executeByPlaceholders(
        "SELECT `c`.`id`, `c`.`employment_id`, `c`.`name`, `employments`.`name` AS `employment_name`, `c`.`from`, `c`.`to`, `weekly_hours`, `pay_group_id` FROM `contracts` AS `c` LEFT JOIN `employments` ON `c`.`employment_id` = `employments`.`id` WHERE `c`.`user_id` = :userId AND `employments`.`user_id` = :userId ORDER BY `c`.`from`, `c`.`to`, `c`.`name`",
        { userId }
    );
};
