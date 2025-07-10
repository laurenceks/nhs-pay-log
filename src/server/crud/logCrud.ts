import {
    executeReadByPlaceholders,
    executeWriteByArray,
    executeWriteByPlaceholders,
} from "../utils/db";
import { ApiPay, ApiShift, ClientShift } from "../../../types/commonTypes";

export const readLogByUserId = async (userId: string) => {
    return await executeReadByPlaceholders<ApiShift>(
        "SELECT `row`.*,\n       `row`.`extra_hours` * `row`.`rate` AS `shift_pay`,\n       `row`.`extras_pay` + (`row`.`extra_hours` * `row`.`rate`) AS `extra_pay`\nFROM (SELECT `log`.`id`,\n             `log`.`date`,\n             `log`.`start`,\n             `log`.`planned_end`,\n             `log`.`actual_end`,\n             `log`.`from`,\n             `log`.`planned_to`,\n             `log`.`actual_to`,\n             `log`.`toil`,\n             `log`.`flat`,\n             `log`.`lower_rate`,\n             `log`.`time_and_half`,\n             `log`.`higher_rate`,\n             `log`.`double`,\n             `log`.`total_ush`,\n             `log`.`contract_id`,\n             `contracts`.`name` AS `contract_name`,\n             `contracts`.`weekly_hours`,\n             `log`.`employment_id`,\n             `employments`.`name` AS `employment_name`,\n             `log`.`extras_ids_string`,\n             `log`.`type`,\n             `log`.`overrun_type`,\n             `log`.`pay_date`,\n             `log`.`pay_month`,\n             `log`.`pay_financial_year`,\n             SUM(`log`.`flat` + (`log`.`lower_rate` * `pb`.`lower_rate_multiplier`) +\n                 (`log`.`time_and_half` * 1.5) + (`log`.`higher_rate` * `pb`.`higher_rate_multiplier`) +\n                 (`log`.`double` * 2)) / 3600000 AS `extra_hours`,\n             `pb`.`pay_hourly` AS `rate`,\n             IFNULL(SUM(`ev`.`value`), 0) AS `extras_pay`\n      FROM `log`\n               LEFT JOIN `contracts` ON `log`.`contract_id` = `contracts`.`id`\n               LEFT JOIN `employments` ON `employments`.`id` = `contracts`.`employment_id`\n               LEFT JOIN `pay_bands` AS `pb` ON\n          IF(`log`.`pay_id_override` IS NULL, `contracts`.`pay_group_id`, `log`.`pay_id_override`) =\n          `pb`.`group_id` AND\n          (`log`.`date` >= `pb`.`from` OR `pb`.`from` IS NULL) AND\n          (`log`.`date` <= `pb`.`to` OR `pb`.`to` IS NULL)\n               LEFT JOIN `log_extras` ON `log`.`id` = `log_extras`.`log_id`\n               LEFT JOIN `extras` ON `log_extras`.`extras_id` = `extras`.`id`\n               LEFT JOIN `extras_values` AS `ev`\n                         ON `extras`.`id` = `ev`.`group_id` AND (`log`.`date` >= `ev`.`from` OR `ev`.`from` IS NULL) AND\n                            (`log`.`date` <= `ev`.`to` OR `ev`.`to` IS NULL)\n      WHERE `log`.`user_id` = :userId\n      GROUP BY `log`.`id`) AS `row`\nORDER BY `row`.`from`, `row`.`employment_name`;",
        { userId: userId }
    );
};
export const readLogByUserIdGroupByPayDate = async (userId: string) => {
    return await executeReadByPlaceholders<ApiPay>(
        "SELECT `calculated_row`.`pay_date`,\n       `calculated_row`.`pay_month`,\n       `calculated_row`.`pay_financial_year`,\n       `calculated_row`.`employment_name`,\n       CAST(SUM(`calculated_row`.`toil`) AS UNSIGNED) AS `toil`,\n       CAST(SUM(`calculated_row`.`flat`) AS UNSIGNED) AS `flat`,\n       CAST(SUM(`calculated_row`.`lower_rate`) AS UNSIGNED) AS `lower_rate`,\n       CAST(SUM(`calculated_row`.`time_and_half`) AS UNSIGNED) AS `time_and_half`,\n       CAST(SUM(`calculated_row`.`higher_rate`) AS UNSIGNED) AS `higher_rate`,\n       CAST(SUM(`calculated_row`.`double`) AS UNSIGNED) AS `double`,\n       CAST(SUM(`calculated_row`.`total_ush`) AS UNSIGNED) AS `total_ush`,\n       SUM(`calculated_row`.`extra_hours`) AS `extra_hours`,\n       SUM(`calculated_row`.`shift_pay`) AS `shift_pay`,\n       SUM(`calculated_row`.`extras_pay`) AS `extras_pay`,\n       SUM(`calculated_row`.`extra_pay`) AS `extra_pay`,\n       MAX(`calculated_row`.`basic_pay`) AS `basic_pay`,\n       LEAST(\n               MAX(`calculated_row`.`max_monthly`) * MAX(`calculated_row`.`weekly_hours_perc`),\n               GREATEST(\n                       MAX(`calculated_row`.`min_monthly`) * MAX(`calculated_row`.`weekly_hours_perc`),\n                       MAX(`calculated_row`.`basic_pay`) * MAX(`calculated_row`.`hca_perc`) +\n                       SUM(`calculated_row`.`hca_flat`)\n               )\n            ) AS `hca_pay`,\n       MAX(`calculated_row`.`basic_pay`) + (MAX(`calculated_row`.`basic_pay`) * MAX(`calculated_row`.`hca_perc`)) +\n       SUM(`calculated_row`.`hca_flat`) +\n       SUM(`calculated_row`.`extra_pay`) AS `gross_pay`\n\nFROM (SELECT `row`.*,\n             `row`.`extra_hours` * `row`.`rate` AS `shift_pay`,\n             (`row`.`extra_hours` * `row`.`rate`) + `row`.`extras_pay` AS `extra_pay`,\n             `row`.`flat` / 3600000 * `row`.`rate` * `row`.`hca_perc` AS `hca_flat`\n      FROM (SELECT `log`.`pay_date`,\n                   `log`.`pay_month`,\n                   `log`.`pay_financial_year`,\n                   `employments`.`name` AS `employment_name`,\n                   `log`.`flat`,\n                   `log`.`lower_rate`,\n                   `log`.`time_and_half`,\n                   `log`.`higher_rate`,\n                   `log`.`double`,\n                   `log`.`toil`,\n                   `log`.`total_ush`,\n                   (`log`.`flat` +\n                    `log`.`lower_rate` * `pb`.`lower_rate_multiplier` +\n                    `log`.`time_and_half` * 1.5 +\n                    `log`.`higher_rate` * `pb`.`higher_rate_multiplier` +\n                    `log`.`double` * 2) / 3600000 AS `extra_hours`,\n                   `pb`.`pay_hourly` AS `rate`,\n                   `bpd`.`pay_monthly` * `contracts`.`weekly_hours_perc` AS `basic_pay`,\n                   IFNULL(`hca`.`hca_perc`, 0) AS `hca_perc`,\n                   IFNULL(`hca`.`max_monthly`, 0) AS `max_monthly`,\n                   IFNULL(`hca`.`min_monthly`, 0) AS `min_monthly`,\n                   `contracts`.`weekly_hours_perc`,\n                   IFNULL(SUM(`ev`.`value`), 0) AS `extras_pay`\n            FROM `log`\n                     LEFT JOIN `contracts` ON `log`.`contract_id` = `contracts`.`id`\n                     LEFT JOIN `employments` ON `employments`.`id` = `contracts`.`employment_id`\n                     LEFT JOIN `pay_bands` AS `pb` ON\n                IF(`log`.`pay_id_override` IS NULL, `contracts`.`pay_group_id`, `log`.`pay_id_override`) =\n                `pb`.`group_id`\n                    AND (`log`.`date` >= `pb`.`from` OR `pb`.`from` IS NULL)\n                    AND (`log`.`date` <= `pb`.`to` OR `pb`.`to` IS NULL)\n\n                     LEFT JOIN `pay_bands` AS `bpd` ON\n                `contracts`.`pay_group_id` = `bpd`.`group_id`\n                    AND (`log`.`date` >= `bpd`.`from` OR `bpd`.`from` IS NULL)\n                    AND (`log`.`date` <= `bpd`.`to` OR `bpd`.`to` IS NULL)\n\n                     LEFT JOIN `hca` ON\n                `contracts`.`hca_group_id` = `hca`.`group_id`\n                    AND (`log`.`date` >= `hca`.`from` OR `hca`.`from` IS NULL)\n                    AND (`log`.`date` <= `hca`.`to` OR `hca`.`to` IS NULL)\n\n                     LEFT JOIN `log_extras` ON `log`.`id` = `log_extras`.`log_id`\n                     LEFT JOIN `extras` ON `log_extras`.`extras_id` = `extras`.`id`\n\n                     LEFT JOIN `extras_values` AS `ev` ON\n                `extras`.`id` = `ev`.`group_id`\n                    AND (`log`.`date` >= `ev`.`from` OR `ev`.`from` IS NULL)\n                    AND (`log`.`date` <= `ev`.`to` OR `ev`.`to` IS NULL)\n\n            WHERE `log`.`user_id` = :userId\n            GROUP BY `log`.`id`) AS `row`) AS `calculated_row`\n\nGROUP BY `calculated_row`.`pay_date`, `calculated_row`.`employment_name`\nORDER BY `calculated_row`.`pay_date`, `calculated_row`.`employment_name`;\n",
        { userId: userId }
    );
};
export const readLogShiftByUserIdAndShiftId = async (
    userId: string,
    shiftId: string
) => {
    return await executeReadByPlaceholders<ApiShift>(
        "SELECT `row`.*,\n       `row`.`extra_hours` * `row`.`rate` AS `shift_pay`,\n       `row`.`extras_pay` + (`row`.`extra_hours` * `row`.`rate`) AS `extra_pay`\nFROM (SELECT `log`.`id`,\n             `log`.`date`,\n             `log`.`start`,\n             `log`.`planned_end`,\n             `log`.`actual_end`,\n             `log`.`from`,\n             `log`.`planned_to`,\n             `log`.`actual_to`,\n             `log`.`toil`,\n             `log`.`flat`,\n             `log`.`lower_rate`,\n             `log`.`time_and_half`,\n             `log`.`higher_rate`,\n             `log`.`double`,\n             `log`.`total_ush`,\n             `log`.`contract_id`,\n             `contracts`.`name` AS `contract_name`,\n             `contracts`.`weekly_hours`,\n             `log`.`employment_id`,\n             `employments`.`name` AS `employment_name`,\n             `log`.`pay_id_override`,\n             `log`.`extras_ids_string`,\n             `log`.`type`,\n             `log`.`overrun_type`,\n             `log`.`pay_date`,\n             `log`.`pay_month`,\n             `log`.`pay_financial_year`,\n             SUM(`log`.`flat` + (`log`.`lower_rate` * `pb`.`lower_rate_multiplier`) +\n                 (`log`.`time_and_half` * 1.5) + (`log`.`higher_rate` * `pb`.`higher_rate_multiplier`) +\n                 (`log`.`double` * 2)) / 3600000 AS `extra_hours`,\n             `pb`.`pay_hourly` AS `rate`,\n             IFNULL(SUM(`ev`.`value`), 0) AS `extras_pay`\n      FROM `log`\n               LEFT JOIN `contracts` ON `log`.`contract_id` = `contracts`.`id`\n               LEFT JOIN `employments` ON `employments`.`id` = `contracts`.`employment_id`\n               LEFT JOIN `pay_bands` AS `pb` ON\n          IF(`log`.`pay_id_override` IS NULL, `contracts`.`pay_group_id`, `log`.`pay_id_override`) =\n          `pb`.`group_id` AND\n          (`log`.`date` >= `pb`.`from` OR `pb`.`from` IS NULL) AND\n          (`log`.`date` <= `pb`.`to` OR `pb`.`to` IS NULL)\n               LEFT JOIN `log_extras` ON `log`.`id` = `log_extras`.`log_id`\n               LEFT JOIN `extras` ON `log_extras`.`extras_id` = `extras`.`id`\n               LEFT JOIN `extras_values` AS `ev`\n                         ON `extras`.`id` = `ev`.`group_id` AND (`log`.`date` >= `ev`.`from` OR `ev`.`from` IS NULL) AND\n                            (`log`.`date` <= `ev`.`to` OR `ev`.`to` IS NULL)\n      WHERE `log`.`user_id` = :userId AND `log`.`id` = :shiftId\n      GROUP BY `log`.`id`) AS `row`\nORDER BY `row`.`from`, `row`.`employment_name`;",
        { userId, shiftId }
    );
};
export const readAffectedLogByUserIdAndShiftId = async (
    userId: string,
    from: string
) => {
    return await executeReadByPlaceholders<ClientShift>(
        "SELECT log.*, `contracts`.`weekly_hours` FROM `log` LEFT JOIN `contracts` ON `log`.`contract_id` = `contracts`.`id` WHERE `log`.`user_id` = :userId AND `contracts`.`user_id` = :userId AND `log`.`from` >= DATE_SUB(DATE(:from), INTERVAL WEEKDAY(:from) DAY) AND log.`from` < DATE_ADD(DATE(:from), INTERVAL (7 - WEEKDAY(:from)) DAY) ORDER BY `log`.`from`",
        { userId, from }
    );
};

export const createLogShift = async (userId: string, shift: ClientShift) => {
    return await executeWriteByPlaceholders(
        "INSERT INTO `log` (`user_id`, `employment_id`, `contract_id`, `date`, `start`, `planned_end`, `actual_end`, `from`, `planned_to`,`actual_to`, `type`, `overrun_type`, `pay_id_override`, `extras_ids_string`, `pay_date`, `pay_month`, `pay_financial_year`, `toil`, `flat`, `lower_rate`, `time_and_half`, `higher_rate`, `double`) VALUES (:userId, :employment_id, :contract_id, :date, :start, :planned_end, :actual_end, :from, :planned_to,:actual_to, :type, :overrun_type, :pay_id_override, :extras, :pay_date, :pay_month, :pay_financial_year, :toil, :flat, :lower_rate, :time_and_half, :higher_rate, :double)",
        {
            actual_end: shift.actual_end,
            actual_to: shift.actual_to,
            date: shift.date,
            double: shift.double,
            employment_id: shift.employment_id,
            contract_id: shift.contract_id,
            extras: shift.extras_ids_string,
            flat: shift.flat,
            from: shift.from,
            higher_rate: shift.higher_rate,
            lower_rate: shift.lower_rate,
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
        "UPDATE `log` SET `employment_id` = :employment_id,`contract_id` = :contract_id, `date` = :date, `start` = :start, `planned_end` = :planned_end, `actual_end` = :actual_end, `from` = :from, `planned_to` = :planned_to,`actual_to` = :actual_to, `type` = :type, `overrun_type` = :overrun_type, `pay_id_override` = :pay_id_override, `pay_date` = :pay_date, `pay_month` = :pay_month, `pay_financial_year` = :pay_financial_year, `extras_ids_string` = :extras, `toil` = :toil, `flat` = :flat, `lower_rate` = :lower_rate, `time_and_half` = :time_and_half, `higher_rate` = :higher_rate, `double` = :double WHERE `user_id` = :userId AND `id` = :id",
        {
            actual_end: shift.actual_end,
            actual_to: shift.actual_to,
            contract_id: shift.contract_id,
            date: shift.date,
            double: shift.double,
            employment_id: shift.employment_id,
            extras: shift.extras_ids_string,
            flat: shift.flat,
            from: shift.from,
            higher_rate: shift.higher_rate,
            id: shift.id,
            lower_rate: shift.lower_rate,
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
export const deleteLogShiftByUserIdAndShiftId = async (
    userId: string,
    shiftId: string
) => {
    return await executeWriteByArray(
        "DELETE FROM `log` WHERE `user_id` = ? AND `id` = ?",
        [userId, shiftId]
    );
};
