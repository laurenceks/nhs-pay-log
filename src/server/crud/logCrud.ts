import {
    executeReadByPlaceholders,
    executeWriteByArray,
    executeWriteByPlaceholders,
} from "../utils/db";
import { ApiPay, ApiShift, ClientShift } from "../../../types/commonTypes";

export const readLogByUserId = async (userId: string) => {
    return await executeReadByPlaceholders<ApiShift>(
        "SELECT `sub`.*, (`sub`.`lower_rate` + `sub`.`higher_rate`) AS `total_ush`, `sub`.`extra_hours` * `sub`.`rate` AS `shift_pay`, `sub`.`extras_pay` + (`sub`.`extra_hours` * `sub`.`rate`) AS `extra_pay` FROM (SELECT `log`.*, SUM(`log`.`flat` + (`log`.`lower_rate` * `pb`.`lower_rate_multiplier`) + (`log`.`time_and_half` * 1.5) + (`log`.`higher_rate` * `pb`.`higher_rate_multiplier`) + (`log`.`double` * 2)) / 3600000 AS `extra_hours`, `pb`.`pay_hourly` AS `rate`, IFNULL(SUM(`ev`.`value`),0) AS `extras_pay` FROM `log` LEFT JOIN `contracts` ON `log`.`contract_id` = `contracts`.`id` LEFT JOIN `pay_bands` AS `pb` ON `contracts`.`pay_group_id` = `pb`.`group_id` AND (`log`.`date` >= `pb`.`from` OR `pb`.`from` IS NULL) AND (`log`.`date` <= `pb`.`to` OR `pb`.`to` IS NULL) LEFT JOIN `log_extras` ON `log`.`id` = `log_extras`.`log_id` LEFT JOIN `extras` ON `log_extras`.`extras_id` = `extras`.`id` LEFT JOIN `extras_values` AS `ev` ON `extras`.`id` = `ev`.`group_id` AND (`log`.`date` >= `ev`.`from` OR `ev`.`from` IS NULL) AND (`log`.`date` <= `ev`.`to` OR `ev`.`to` IS NULL) WHERE `log`.`user_id` = :userId GROUP BY `log`.`id`) AS `sub`;",
        { userId: userId }
    );
};
export const readLogByUserIdGroupByPayDate = async (userId: string) => {
    return await executeReadByPlaceholders<ApiPay>(
        "SELECT `sub`.*, (`sub`.`lower_rate` + `sub`.`higher_rate`) AS `total_ush`, `sub`.`extra_hours` * `sub`.`rate` AS `shift_pay`, `sub`.`extras_pay` + (`sub`.`extra_hours` * `sub`.`rate`) AS `extra_pay`, `sub`.`extras_pay` + (`sub`.`extra_hours` * `sub`.`rate`) + `sub`.`basic_pay` AS `gross_pay` FROM (SELECT `log`.*, SUM(`log`.`flat` + (`log`.`lower_rate` * `pb`.`lower_rate_multiplier`) + (`log`.`time_and_half` * 1.5) + (`log`.`higher_rate` * `pb`.`higher_rate_multiplier`) + (`log`.`double` * 2)) / 3600000 AS `extra_hours`, `pb`.`pay_hourly` AS `rate`, (`pb`.`pay_monthly`*`contracts`.`weekly_hours`/37.5) AS `basic_pay`, IFNULL(SUM(`ev`.`value`),0) AS `extras_pay` FROM `log` LEFT JOIN `contracts` ON `log`.`contract_id` = `contracts`.`id` LEFT JOIN `pay_bands` AS `pb` ON `contracts`.`pay_group_id` = `pb`.`group_id` AND (`log`.`date` >= `pb`.`from` OR `pb`.`from` IS NULL) AND (`log`.`date` <= `pb`.`to` OR `pb`.`to` IS NULL) LEFT JOIN `log_extras` ON `log`.`id` = `log_extras`.`log_id` LEFT JOIN `extras` ON `log_extras`.`extras_id` = `extras`.`id` LEFT JOIN `extras_values` AS `ev` ON `extras`.`id` = `ev`.`group_id` AND (`log`.`date` >= `ev`.`from` OR `ev`.`from` IS NULL) AND (`log`.`date` <= `ev`.`to` OR `ev`.`to` IS NULL) WHERE `log`.`user_id` = :userId GROUP BY `log`.`pay_date`) AS `sub`;",
        { userId: userId }
    );
};
export const readLogShiftByUserIdAndShiftId = async (
    userId: string,
    shiftId: string
) => {
    return await executeReadByPlaceholders<ApiShift>(
        "SELECT `sub`.*, (`sub`.`lower_rate` + `sub`.`higher_rate`) AS `total_ush`, `sub`.`extra_hours` * `sub`.`rate` AS `shift_pay`, `sub`.`extras_pay` + (`sub`.`extra_hours` * `sub`.`rate`) AS `extra_pay` FROM (SELECT `log`.*, SUM(`log`.`flat` + (`log`.`lower_rate` * `pb`.`lower_rate_multiplier`) + (`log`.`time_and_half` * 1.5) + (`log`.`higher_rate` * `pb`.`higher_rate_multiplier`) + (`log`.`double` * 2)) / 3600000 AS `extra_hours`, `pb`.`pay_hourly` AS `rate`, IFNULL(SUM(`ev`.`value`), 0) AS `extras_pay` FROM `log` LEFT JOIN `contracts` ON `log`.`contract_id` = `contracts`.`id` LEFT JOIN `pay_bands` AS `pb` ON `contracts`.`pay_group_id` = `pb`.`group_id` AND (`log`.`date` >= `pb`.`from` OR `pb`.`from` IS NULL) AND (`log`.`date` <= `pb`.`to` OR `pb`.`to` IS NULL) LEFT JOIN `log_extras` ON `log`.`id` = `log_extras`.`log_id` LEFT JOIN `extras` ON `log_extras`.`extras_id` = `extras`.`id` LEFT JOIN `extras_values` AS `ev` ON `extras`.`id` = `ev`.`group_id` AND (`log`.`date` >= `ev`.`from` OR `ev`.`from` IS NULL) AND (`log`.`date` <= `ev`.`to` OR `ev`.`to` IS NULL) WHERE `log`.`user_id` = :userId AND `log`.`id` = :shiftId GROUP BY `log`.`id`) AS `sub`;",
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
