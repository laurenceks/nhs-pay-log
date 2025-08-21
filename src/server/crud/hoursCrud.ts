import { executeReadByPlaceholders } from "../utils/db";
import { ApiHours } from "../../../types/commonTypes";

export const readHoursByUserAndEmploymentId = async (
    userId: string,
    employmentId: string
) => {
    return await executeReadByPlaceholders<ApiHours>(
        "WITH RECURSIVE `weeks`\n                   AS (SELECT DATE_SUB(MIN(`log`.`date`), INTERVAL WEEKDAY(MIN(`log`.`date`)) DAY) AS `week_commencing`,\n                              DATE_SUB(MAX(`log`.`date`), INTERVAL WEEKDAY(MAX(`log`.`date`)) DAY) AS `last_week`\n                       FROM `log`\n                       WHERE `log`.`user_id` = :userId AND `log`.`employment_id` = :employmentId\n                       UNION ALL\n                       SELECT `week_commencing` + INTERVAL 7 DAY, `last_week`\n                       FROM `weeks`\n                       WHERE `week_commencing` + INTERVAL 7 DAY <= `last_week`)\nSELECT `weeks`.`week_commencing`,\n       SUM(`log`.`planned_hours`) AS `planned_hours`,\n       SUM(`log`.`actual_hours`) AS `actual_hours`,\n       SUM(`log`.`overrun_hours`) AS `overrun_hours`,\n       SUM(`log`.`flat`) AS `flat`,\n       SUM(`log`.`lower_rate`) AS `lower_rate`,\n       SUM(`log`.`time_and_half`) AS `time_and_half`,\n       SUM(`log`.`higher_rate`) AS `higher_rate`,\n       SUM(`log`.`double`) AS `double`,\n       SUM(`log`.`absent_hours`) AS `absent_hours`,\n       SUM(IF(`log`.`type` = \'Bank\', `log`.`actual_hours`,\n              `log`.`flat` + `log`.`time_and_half` + `log`.`double` + `log`.`toil`)) AS `extra_hours`,\n       SUM(IF(`log`.`type` = \'Normal\', `log`.`planned_hours`, 0)) AS `normal_hours`,\n       SUM(IF(`log`.`type` = \'Normal\', `log`.`planned_hours`, 0) + `log`.`absent_hours`) - AVG(`contracts`.`weekly_hours` * 3600000) AS `weekly_hours_diff`\nFROM `weeks`\n         LEFT JOIN `log` ON DATE_SUB(`log`.`date`, INTERVAL WEEKDAY(`log`.`date`) DAY) = `weeks`.`week_commencing`\n         LEFT JOIN `contracts` ON\n    `contracts`.`employment_id` = `log`.`employment_id`\n        AND (`log`.`date` >= `contracts`.`from` OR `contracts`.`from` IS NULL)\n        AND (`log`.`date` <= `contracts`.`to` OR `contracts`.`to` IS NULL)\nWHERE `log`.`user_id` = :userId AND `log`.`employment_id` = :employmentId\nGROUP BY `weeks`.`week_commencing`\nORDER BY `weeks`.`week_commencing`;",
        { userId, employmentId }
    );
};
