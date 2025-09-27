import {
    executeReadByPlaceholders,
    executeWriteByArray,
    executeWriteByPlaceholders,
} from "../utils/db";
import { ApiShift, ClientShift } from "../../../types/commonTypes";
import { Section2LogEntry } from "../../shared/calculations/section2";

export const readLogByUserId = async (userId: string) => {
    return await executeReadByPlaceholders<ApiShift>(
        "SELECT `row`.*,\n       `row`.`extra_hours` * `row`.`rate` AS `shift_pay`,\n       `row`.`extras_pay` + (`row`.`extra_hours` * `row`.`rate`) AS `extra_pay`\nFROM (SELECT `log`.`id`,\n             `log`.`date`,\n             `log`.`start`,\n             `log`.`planned_end`,\n             `log`.`actual_end`,\n             `log`.`from`,\n             `log`.`planned_to`,\n             `log`.`actual_to`,\n             `log`.`toil`,\n             `log`.`flat`,\n             `log`.`lower_rate`,\n             `log`.`time_and_half`,\n             `log`.`higher_rate`,\n             `log`.`double`,\n             `log`.`total_ush`,\n             `log`.`absent_hours`,\n             `log`.`actual_hours`,\n             `log`.`overrun_hours`,\n             `contracts`.`id` AS `contract_id`,\n             `contracts`.`weekly_hours`,\n             `contracts`.`half_is_all_ush`,\n             `contracts`.`break_from_higher`,\n             `contracts`.`leave_relief_ush_type`,\n             `log`.`employment_id`,\n             `employments`.`name` AS `employment_name`,\n             `log`.`extras_ids_string`,\n             `log`.`type`,\n             `log`.`overrun_type`,\n             `log`.`pay_date`,\n             `log`.`pay_month`,\n             `log`.`pay_financial_year`,\n             MAX(`log`.`flat` + (`log`.`lower_rate` * `pb`.`lower_rate_multiplier`) +\n                 (`log`.`time_and_half` * 1.5) + (`log`.`higher_rate` * `pb`.`higher_rate_multiplier`) +\n                 (`log`.`double` * 2)) / 3600000 AS `extra_hours`,\n             `pb`.`pay_hourly` AS `rate`,\n             SUM(IFNULL(`ev`.`value`, 0)) AS `extras_pay`\n      FROM `log`\n               LEFT JOIN `employments` ON `employments`.`id` = `log`.`employment_id`\n               LEFT JOIN `contracts` ON\n          `contracts`.`employment_id` = `log`.`employment_id`\n              AND (`log`.`date` >= `contracts`.`from` OR `contracts`.`from` IS NULL)\n              AND (`log`.`date` <= `contracts`.`to` OR `contracts`.`to` IS NULL)\n               LEFT JOIN `pay_bands` AS `pb` ON\n          IF(`log`.`pay_id_override` IS NULL, `contracts`.`pay_group_id`, `log`.`pay_id_override`) =\n          `pb`.`group_id` AND\n          (`log`.`date` >= `pb`.`from` OR `pb`.`from` IS NULL) AND\n          (`log`.`date` <= `pb`.`to` OR `pb`.`to` IS NULL)\n               LEFT JOIN `log_extras` ON `log`.`id` = `log_extras`.`log_id`\n               LEFT JOIN `extras` ON `log_extras`.`extras_id` = `extras`.`id`\n               LEFT JOIN `extras_values` AS `ev`\n                         ON `extras`.`id` = `ev`.`group_id` AND (`log`.`date` >= `ev`.`from` OR `ev`.`from` IS NULL) AND\n                            (`log`.`date` <= `ev`.`to` OR `ev`.`to` IS NULL)\n      WHERE `log`.`user_id` = :userId\n      GROUP BY `log`.`id`) AS `row`\nORDER BY `row`.`from`, `row`.`employment_name`;",
        { userId: userId }
    );
};
export const readLogByUserIdAndEmploymentId = async (
    userId: string,
    employmentId: string | number
) => {
    return await executeReadByPlaceholders<ApiShift>(
        "SELECT `log`.*,\n       `contracts`.`id` AS `contract_id`,\n       `contracts`.`weekly_hours`,\n       `contracts`.`half_is_all_ush`,\n       `contracts`.`break_from_higher`,\n       `contracts`.`leave_relief_ush_type`\nFROM `log`\n         LEFT JOIN `employments` ON `employments`.`id` = `log`.`employment_id`\n         LEFT JOIN `contracts` ON\n    `contracts`.`employment_id` = `log`.`employment_id`\n        AND (`log`.`date` >= `contracts`.`from` OR `contracts`.`from` IS NULL)\n        AND (`log`.`date` <= `contracts`.`to` OR `contracts`.`to` IS NULL)\nWHERE `log`.`user_id` = :userId AND `log`.`employment_id` = :employmentId\nORDER BY `log`.`from`",
        { userId, employmentId }
    );
};
export const readLogShiftByUserIdAndShiftId = async (
    userId: string,
    shiftId: string
) => {
    return await executeReadByPlaceholders<ApiShift>(
        "SELECT `row`.*,\n       `row`.`extra_hours` * `row`.`rate` AS `shift_pay`,\n       `row`.`extras_pay` + (`row`.`extra_hours` * `row`.`rate`) AS `extra_pay`\nFROM (SELECT `log`.`id`,\n             `log`.`date`,\n             `log`.`start`,\n             `log`.`planned_end`,\n             `log`.`actual_end`,\n             `log`.`from`,\n             `log`.`planned_to`,\n             `log`.`actual_to`,\n             `log`.`toil`,\n             `log`.`flat`,\n             `log`.`lower_rate`,\n             `log`.`time_and_half`,\n             `log`.`higher_rate`,\n             `log`.`double`,\n             `log`.`total_ush`,\n             `log`.`absent_hours`,\n             `log`.`actual_hours`,\n             `log`.`overrun_hours`,\n             `contracts`.`id` AS `contract_id`,\n             `contracts`.`weekly_hours`,\n             `contracts`.`half_is_all_ush`,\n             `contracts`.`break_from_higher`,\n             `contracts`.`leave_relief_ush_type`,\n             `log`.`employment_id`,\n             `employments`.`name` AS `employment_name`,\n             `log`.`pay_id_override`,\n             `log`.`break_override`,\n             `log`.`break_override_string`,\n             `log`.`extras_ids_string`,\n             `log`.`type`,\n             `log`.`overrun_type`,\n             `log`.`pay_date`,\n             `log`.`pay_month`,\n             `log`.`flowers_pay_month`,\n             `log`.`pay_financial_year`,\n             `log`.`notes`,\n             MAX(`log`.`flat` + (`log`.`lower_rate` * `pb`.`lower_rate_multiplier`) +\n                 (`log`.`time_and_half` * 1.5) + (`log`.`higher_rate` * `pb`.`higher_rate_multiplier`) +\n                 (`log`.`double` * 2)) / 3600000 AS `extra_hours`,\n             `pb`.`pay_hourly` AS `rate`,\n             IFNULL(SUM(`ev`.`value`), 0) AS `extras_pay`\n      FROM `log`\n               LEFT JOIN `employments` ON `employments`.`id` = `log`.`employment_id`\n               LEFT JOIN `contracts` ON\n          `contracts`.`employment_id` = `log`.`employment_id`\n              AND (`log`.`date` >= `contracts`.`from` OR `contracts`.`from` IS NULL)\n              AND (`log`.`date` <= `contracts`.`to` OR `contracts`.`to` IS NULL)\n               LEFT JOIN `pay_bands` AS `pb` ON\n          IF(`log`.`pay_id_override` IS NULL, `contracts`.`pay_group_id`, `log`.`pay_id_override`) =\n          `pb`.`group_id` AND\n          (`log`.`date` >= `pb`.`from` OR `pb`.`from` IS NULL) AND\n          (`log`.`date` <= `pb`.`to` OR `pb`.`to` IS NULL)\n               LEFT JOIN `log_extras` ON `log`.`id` = `log_extras`.`log_id`\n               LEFT JOIN `extras` ON `log_extras`.`extras_id` = `extras`.`id`\n               LEFT JOIN `extras_values` AS `ev`\n                         ON `extras`.`id` = `ev`.`group_id` AND (`log`.`date` >= `ev`.`from` OR `ev`.`from` IS NULL) AND\n                            (`log`.`date` <= `ev`.`to` OR `ev`.`to` IS NULL)\n      WHERE `log`.`user_id` = :userId AND `log`.`id` = :shiftId\n      GROUP BY `log`.`id`) AS `row`\nORDER BY `row`.`from`, `row`.`employment_name`;",
        { userId, shiftId }
    );
};
export const readAffectedLogByUserIdAndShiftId = async (
    userId: string,
    from: string,
    employmentId: string | number
) => {
    return await executeReadByPlaceholders<ClientShift>(
        "SELECT `log`.*,\n       `contracts`.`weekly_hours`,\n       `contracts`.`half_is_all_ush`,\n       `contracts`.`break_from_higher`,\n       `contracts`.`leave_relief_ush_type`\nFROM `log`\n         LEFT JOIN `contracts` ON\n    `contracts`.`employment_id` = `log`.`employment_id`\n        AND (`log`.`date` >= `contracts`.`from` OR `contracts`.`from` IS NULL)\n        AND (`log`.`date` <= `contracts`.`to` OR `contracts`.`to` IS NULL)\nWHERE `log`.`user_id` = :userId\n  AND `contracts`.`user_id` = :userId\n  AND `log`.`employment_id` = :employmentId\n  AND `log`.`from` >= DATE_SUB(DATE(:from), INTERVAL WEEKDAY(:from) DAY)\n  AND `log`.`from` < DATE_ADD(DATE(:from), INTERVAL (7 - WEEKDAY(:from)) DAY)\nORDER BY `log`.`from`",
        { userId, from, employmentId }
    );
};
export const readUshAverageLogByUserIdAndEmploymentId = async (
    userId: string,
    from: string,
    employmentId: string | number,
    weeks: 13 | 52
) => {
    return await executeReadByPlaceholders<Section2LogEntry>(
        "SELECT `log`.`date`,\n       `log`.`type`,\n       `log`.`lower_rate`,\n       `log`.`higher_rate`,\n       `log`.`actual_hours`,\n       `log`.`overrun_hours`,\n       `log`.`employment_id`,\n       `log`.`overrun_type`,\n       `log`.`actual_to`,\n       `log`.`break_override`,\n       `log`.`from`,\n       `log`.`planned_to`,\n       `log`.`absent_hours`,\n       `log`.`double`,\n       `log`.`flat`,\n       `log`.`time_and_half`,\n       `log`.`toil`\nFROM `log`\nWHERE `log`.`user_id` = :userId\n  AND `log`.`employment_id` = :employmentId\n  AND `log`.`from` >= DATE_SUB(DATE(:from), INTERVAL :weeks WEEK)\n  AND `log`.`from` < DATE(:from)\nORDER BY `log`.`from`",
        { userId, from, employmentId, weeks }
    );
};

export const readLogIdsByUserIdAndEmploymentId = async (
    userId: string,
    employmentId: string | number
) => {
    return await executeReadByPlaceholders<ClientShift>(
        "SELECT `log`.`id`\nFROM `log`\nWHERE `log`.`user_id` = :userId\n  AND `log`.`employment_id` = :employmentId",
        { userId, employmentId }
    );
};
export const readOrphanedLogByUserIdAndEmploymentIdAndNewFromOrTo = async (
    userId: string,
    employmentId: string | number,
    from: string | null,
    to: string | null
) => {
    return await executeReadByPlaceholders<ClientShift>(
        "SELECT `log`.`id`\nFROM `log`\nWHERE `log`.`user_id` = :userId\n  AND `log`.`employment_id` = :employmentId\n  AND ((:from IS NOT NULL AND `log`.`date` < :from)\n    OR (:to IS NOT NULL AND `log`.`date` > :to))",
        { userId, employmentId, from, to }
    );
};
export const readLogWithNoAlternativeEmploymentByUserId = async (
    userId: string,
    employmentId: string | number
) => {
    return await executeReadByPlaceholders<ClientShift>(
        "SELECT `log`.`id`, `log`.`date`, `contracts`.`employment_id`\nFROM `log`\n         LEFT JOIN `contracts` ON `log`.`employment_id` != `contracts`.`employment_id` AND\n                                  `log`.`user_id` = `contracts`.`user_id` AND\n                                  ((`contracts`.`from` IS NOT NULL AND `contracts`.`to` IS NOT NULL AND\n                                    `log`.`date` BETWEEN `contracts`.`from` AND `contracts`.`to`) OR\n                                   (`contracts`.`from` IS NULL AND `contracts`.`to` IS NOT NULL AND\n                                    `log`.`date` <= `contracts`.`to`) OR\n                                   (`contracts`.`to` IS NULL AND `contracts`.`from` IS NOT NULL AND\n                                    `log`.`date` >= `contracts`.`from`) OR\n                                   (`contracts`.`from` IS NULL AND `contracts`.`to` IS NULL))\nWHERE `log`.`user_id` = :userId\n  AND `log`.`employment_id` = :employmentId\n  AND `contracts`.`employment_id` IS NULL",
        { userId, employmentId }
    );
};

export const createLogShift = async (userId: string, shift: ClientShift) => {
    return await executeWriteByPlaceholders(
        "INSERT INTO `log` (`user_id`,\n                   `employment_id`,\n                   `date`,\n                   `start`,\n                   `planned_end`,\n                   `actual_end`,\n                   `from`,\n                   `planned_to`,\n                   `actual_to`,\n                   `type`,\n                   `overrun_type`,\n                   `pay_id_override`,\n                   `break_override`,\n                   `break_override_string`,\n                   `extras_ids_string`,\n                   `pay_date`,\n                   `pay_month`,\n                   `flowers_pay_month`,\n                   `pay_financial_year`,\n                   `toil`,\n                   `flat`,\n                   `lower_rate`,\n                   `time_and_half`,\n                   `higher_rate`,\n                   `double`,\n                   `notes`)\nVALUES (:userId,\n        :employment_id,\n        :date,\n        :start,\n        :planned_end,\n        :actual_end,\n        :from,\n        :planned_to,\n        :actual_to,\n        :type,\n        :overrun_type,\n        :pay_id_override,\n        :break_override,\n        :break_override_string,\n        :extras,\n        :pay_date,\n        :pay_month,\n        DATE_FORMAT(DATE_ADD(:pay_date, INTERVAL 1 MONTH), \'%y-%m\'),\n        :pay_financial_year,\n        :toil,\n        :flat,\n        :lower_rate,\n        :time_and_half,\n        :higher_rate,\n        :double,\n        :notes)",
        {
            actual_end: shift.actual_end,
            actual_to: shift.actual_to,
            break_override: shift.break_override,
            break_override_string: shift.break_override_string,
            contract_id: shift.contract_id,
            date: shift.date,
            double: shift.double,
            employment_id: shift.employment_id,
            extras: shift.extras_ids_string,
            flat: shift.flat,
            flowers_pay_month: shift.flowers_pay_month,
            from: shift.from,
            higher_rate: shift.higher_rate,
            lower_rate: shift.lower_rate,
            notes: shift.notes,
            overrun_type: shift.overrun_type,
            pay_date: shift.pay_date,
            pay_financial_year: shift.pay_financial_year,
            pay_id_override: shift.pay_id_override,
            pay_month: shift.pay_month,
            planned_end: shift.planned_end,
            planned_to: shift.planned_to,
            start: shift.start,
            time_and_half: shift.time_and_half,
            toil: shift.toil,
            type: shift.type,
            userId: userId,
        }
    );
};
export const updateLogShiftByUserIdAndShiftId = async (
    userId: string,
    shift: ClientShift
) => {
    return await executeWriteByPlaceholders(
        "UPDATE `log`\nSET `employment_id` = :employment_id,\n    `date` = :date,\n    `start` = :start,\n    `planned_end` = :planned_end,\n    `actual_end` = :actual_end,\n    `from` = :from,\n    `planned_to` = :planned_to,\n    `actual_to` = :actual_to,\n    `type` = :type,\n    `overrun_type` = :overrun_type,\n    `pay_id_override` = :pay_id_override,\n    `break_override` = :break_override,\n    `break_override_string` = :break_override_string,\n    `pay_date` = :pay_date,\n    `pay_month` = :pay_month,\n    `flowers_pay_month` = DATE_FORMAT(DATE_ADD(:pay_date, INTERVAL 1 MONTH), \'%y-%m\'),\n    `pay_financial_year` = :pay_financial_year,\n    `extras_ids_string` = :extras,\n    `toil` = :toil,\n    `flat` = :flat,\n    `lower_rate` = :lower_rate,\n    `time_and_half` = :time_and_half,\n    `higher_rate` = :higher_rate,\n    `double` = :double,\n    `notes` = :notes\nWHERE `user_id` = :userId AND `id` = :id",
        {
            actual_end: shift.actual_end,
            actual_to: shift.actual_to,
            break_override: shift.break_override,
            break_override_string: shift.break_override_string,
            contract_id: shift.contract_id,
            date: shift.date,
            double: shift.double,
            employment_id: shift.employment_id,
            extras: shift.extras_ids_string,
            flat: shift.flat,
            flowers_pay_month: shift.flowers_pay_month,
            from: shift.from,
            higher_rate: shift.higher_rate,
            id: shift.id,
            lower_rate: shift.lower_rate,
            notes: shift.notes,
            overrun_type: shift.overrun_type,
            pay_date: shift.pay_date,
            pay_financial_year: shift.pay_financial_year,
            pay_id_override: shift.pay_id_override,
            pay_month: shift.pay_month,
            planned_end: shift.planned_end,
            planned_to: shift.planned_to,
            start: shift.start,
            time_and_half: shift.time_and_half,
            toil: shift.toil,
            type: shift.type,
            userId,
        }
    );
};
export const updateOrphanedLogShiftByUserIdAndFormerEmploymentID = async (
    userId: string,
    oldEmploymentId: string | number
) => {
    return await executeWriteByPlaceholders(
        "UPDATE `log`\nSET `employment_id` = (SELECT `contracts`.`employment_id`\n                       FROM `contracts`\n                       WHERE `contracts`.`employment_id` != :oldEmploymentId\n                         AND `contracts`.`user_id` = :userId\n                         AND (\n                           (`contracts`.`from` IS NOT NULL AND `contracts`.`to` IS NOT NULL AND\n                            `log`.`date` BETWEEN `contracts`.`from` AND `contracts`.`to`) OR\n                           (`contracts`.`from` IS NULL AND `contracts`.`to` IS NOT NULL AND\n                            `log`.`date` <= `contracts`.`to`) OR\n                           (`contracts`.`to` IS NULL AND `contracts`.`from` IS NOT NULL AND\n                            `log`.`date` >= `contracts`.`from`) OR\n                           (`contracts`.`from` IS NULL AND `contracts`.`to` IS NULL))\n                       ORDER BY `contracts`.`employment_id`, `contracts`.`from`\n                       LIMIT 1)\nWHERE `log`.`user_id` = :userId AND `log`.`employment_id` = :oldEmploymentId",
        {
            userId,
            oldEmploymentId,
        }
    );
};
export const deleteLogShiftByUserIdAndShiftId = async (
    userId: string,
    shiftId: string
) => {
    return await executeWriteByArray(
        "DELETE FROM `log` WHERE `user_id` = ? AND `id` = ?",
        [userId, shiftId]
    );
};
