import { executeByArray, executeByPlaceholders } from "../utils/db";
import { LogShift } from "../../../types/commonTypes";

export const readLogByUserId = async (userId: string) => {
    return await executeByPlaceholders(
        "SELECT log.*, `employments`.`name` AS `employment_name`, `contracts`.`name` AS `contract_name`, `contracts`.`weekly_hours` FROM `log` LEFT JOIN `contracts` ON `log`.`contract_id` = `contracts`.`id` LEFT JOIN `employments` ON `log`.`employment_id` = `employments`.`id` WHERE `contracts`.`user_id` = :userId AND log.`user_id` = :userId AND `employments`.`user_id` = :userId ORDER BY `from`, `employment_name`",
        { userId: userId }
    );
};
export const readLogShiftByUserIdAndShiftId = async (
    userId: string,
    shiftId: string
) => {
    return await executeByPlaceholders(
        "SELECT log.*, `contracts`.`weekly_hours` FROM `log` LEFT JOIN `contracts` ON `log`.`contract_id` = `contracts`.`id` WHERE `log`.`user_id` = :userId AND `contracts`.`user_id` = :userId AND `log`.`id` = :shiftId",
        { userId, shiftId }
    );
};

export const createLogShift = async (userId: string, shift: LogShift) => {
    return await executeByPlaceholders(
        "INSERT INTO `log` (`user_id`, `employment_id`, `contract_id`, `date`, `start`, `planned_end`, `actual_end`, `from`, `planned_to`,`actual_to`, `type`, `overrun_type`, `pay_id_override`, `extras`, `pay_date`, `pay_month`, `pay_financial_year`, `toil`, `flat`, `lower_rate`, `time_and_half`, `higher_rate`, `double`) VALUES (:userId, :employment_id, :contract_id, :date, :start, :planned_end, :actual_end, :from, :planned_to,:actual_to, :type, :overrun_type, :pay_id_override, :extras, :pay_date, :pay_month, :pay_financial_year, :toil, :flat, :lower_rate, :time_and_half, :higher_rate, :double)",
        {
            actual_end: shift.actual_end,
            actual_to: shift.actual_to,
            date: shift.date,
            double: shift.double,
            employment_id: shift.employment_id,
            contract_id: shift.contract_id,
            extras: shift.extras,
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
    shift: LogShift
) => {
    return await executeByPlaceholders(
        "UPDATE `log` SET `employment_id` = :employment_id,`contract_id` = :contract_id, `date` = :date, `start` = :start, `planned_end` = :planned_end, `actual_end` = :actual_end, `from` = :from, `planned_to` = :planned_to,`actual_to` = :actual_to, `type` = :type, `overrun_type` = :overrun_type, `pay_id_override` = :pay_id_override, `pay_date` = :pay_date, `pay_month` = :pay_month, `pay_financial_year` = :pay_financial_year, `extras` = :extras, `toil` = :toil, `flat` = :flat, `lower_rate` = :lower_rate, `time_and_half` = :time_and_half, `higher_rate` = :higher_rate, `double` = :double WHERE `user_id` = :userId AND `id` = :id",
        {
            actual_end: shift.actual_end,
            actual_to: shift.actual_to,
            contract_id: shift.contract_id,
            date: shift.date,
            double: shift.double,
            employment_id: shift.employment_id,
            extras: shift.extras,
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
    return await executeByArray(
        "DELETE FROM `log` WHERE `user_id` = ? AND `id` = ?",
        [userId, shiftId]
    );
};
