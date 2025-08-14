import { executeReadByPlaceholders } from "../utils/db";
import { TimesheetOption, TimesheetShift } from "../../../types/commonTypes";

export const readTimesheetListByUserId = async (userId: string) => {
    return await executeReadByPlaceholders<TimesheetOption>(
        "SELECT `log`.`employment_id`,\n       `employments`.`name` AS `employment_name`,\n       DATE_FORMAT(`log`.`date`, \'%y-%m\') AS `timesheet_month`,\n       CONCAT(DATE_FORMAT(`log`.`date`, \'%M %y\'), \' \', `employments`.`name`) AS `label`\nFROM `log`\n         LEFT JOIN `employments` ON `log`.`employment_id` = `employments`.`id`\nWHERE `log`.`user_id` = :userId\nGROUP BY `log`.`employment_id`, `timesheet_month`\nORDER BY `timesheet_month` DESC",
        { userId }
    );
};
export const readTimesheetByUserIdEmploymentIdAndTimesheetMonth = async (
    userId: string,
    employmentId: string | number,
    payMonth: string | number
) => {
    return await executeReadByPlaceholders<TimesheetShift>(
        "SELECT `log`.`id`,\n       `log`.`type`,\n       `log`.`overrun_type`,\n       `log`.`employment_id`,\n       `employments`.`name` AS `employment_name`,\n       `log`.`date`,\n       `log`.`start`,\n       `log`.`planned_end`,\n       `log`.`actual_end`,\n       `log`.`toil`,\n       `log`.`flat`,\n       `log`.`lower_rate`,\n       `log`.`time_and_half`,\n       `log`.`total_ush`,\n       `log`.`higher_rate`,\n       `log`.`double`,\n       `log`.`absent_hours`,\n       `log`.`additional_hours`,\n       `log`.`planned_hours`,\n       `log`.`actual_hours`,\n       CAST(IFNULL(SUM(`log_extras`.`extras_id` = 1), 0) AS UNSIGNED) AS `oowmb`,\n       CAST(IFNULL(SUM(`log_extras`.`extras_id` = 2), 0) AS UNSIGNED) AS `ooamb`,\n       CAST(IFNULL(SUM(`log_extras`.`extras_id` = 3), 0) AS UNSIGNED) AS `snsc`\nFROM `log`\n         LEFT JOIN `employments` ON `log`.`employment_id` = `employments`.`id`\n         LEFT JOIN `log_extras` ON `log`.`id` = `log_extras`.`log_id`\nWHERE `log`.`user_id` = :userId\n  AND `log`.`employment_id` = :employmentId\n  AND DATE_FORMAT(`log`.`date`, \'%y-%m\') = :payMonth\nGROUP BY `log`.`id`, `log`.`from`\nORDER BY `log`.`from`",
        { userId, employmentId, payMonth }
    );
};
