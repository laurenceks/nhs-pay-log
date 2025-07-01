import { executeByPlaceholders } from "../utils/db";

export const readExtrasByUserId = async (userId: string) => {
    return await executeByPlaceholders(
        "SELECT `e`.`id`, `e`.`label`, `v`.`group_id`, `v`.`from`, `v`.`to`, v.`value` FROM `extras` `e`  LEFT JOIN `extras_values` `v` ON `e`.`id` = `v`.`group_id`",
        { userId }
    );
};
