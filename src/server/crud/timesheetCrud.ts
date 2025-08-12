import { executeReadByPlaceholders } from "../utils/db";
import { TimesheetShift } from "../../../types/commonTypes";

export const readTimesheetsByUserId = async (userId: string) => {
    return await executeReadByPlaceholders<TimesheetShift>(
        "SELECT `log`.`employment_id`,\n       `employments`.`name` AS `employment_name`,\n       DATE_FORMAT(`log`.`date`, \'%y-%m\') AS `timesheet_month`,\n       CONCAT(DATE_FORMAT(`log`.`date`, \'%M %y\'), \' \', `employments`.`name`) AS `label`\nFROM `log`\n         LEFT JOIN `employments` ON `log`.`employment_id` = `employments`.`id`\nWHERE `log`.`user_id` = :userId\nGROUP BY `log`.`employment_id`, `timesheet_month`\nORDER BY `timesheet_month`",
        { userId }
    );
};
export const readTimesheetByUserIdEmploymentIdAndTimesheetMonth = async (
    userId: string,
    employmentId: string | number,
    payMonth: string | number
) => {
    return await executeReadByPlaceholders<TimesheetShift>(
        "SELECT `log`.`id`,\n       `log`.`type`,\n       `log`.`overrun_type`,\n       `log`.`employment_id`,\n       `employments`.`name` AS `employment_name`,\n       `log`.`date`,\n       `log`.`start`,\n       `log`.`planned_end`,\n       `log`.`actual_end`,\n       `log`.`toil`,\n       `log`.`flat`,\n       `log`.`lower_rate`,\n       `log`.`time_and_half`,\n       `log`.`total_ush`,\n       `log`.`higher_rate`,\n       `log`.`double`,\n       CAST(TIMESTAMPDIFF(MICROSECOND, `log`.`from`, `log`.`planned_to`) / 1000 AS UNSIGNED) AS `planned_duration`,\n       CAST(TIMESTAMPDIFF(MICROSECOND, `log`.`from`, `log`.`actual_to`) / 1000 AS UNSIGNED) AS `actual_duration`\nFROM `log`\n         LEFT JOIN `employments` ON `log`.`employment_id` = `employments`.`id`\nWHERE `log`.`user_id` = :userId\n  AND `log`.`employment_id` = :employmentId\n  AND DATE_FORMAT(`log`.`date`, \'%y-%m\') = :payMonth\nORDER BY `log`.`from`",
        { userId, employmentId, payMonth }
    );
};
