import { query } from "../utils/db";

export const readPayBands = async () => {
    return await query(
        "SELECT `id`, `group_id`, `label`, `from`, `to`, `pay_hourly`, `pay_monthly`, `pay_annually`,`lower_rate_multiplier`, `higher_rate_multiplier` FROM `pay_bands` ORDER BY `group_id`, `from`, `to`"
    );
};
export const readPayBandsForRegistering = async () => {
    return await query(
        "SELECT `group_id` AS `pay_group_id`, `label` FROM `pay_bands` WHERE `from` IS NOT NULL AND `from` <= NOW() AND (`to` IS NULL OR `to` > NOW()) ORDER BY `group_id`"
    );
};
