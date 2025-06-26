import { query } from "../utils/db";

export const readPayBandsForRegistering = async () => {
    return await query(
        "SELECT `group_id`, `label` FROM `pay_bands` WHERE `from` IS NOT NULL AND `from` <= NOW() AND (`to` IS NULL OR `to` > NOW()) ORDER BY `group_id`"
    );
};
