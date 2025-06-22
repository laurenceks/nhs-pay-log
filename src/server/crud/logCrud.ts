import { executeByArray, executeByPlaceholders } from "../utils/db";
import { LogShift } from "../../../types/commonTypes";

export const readLogByUserId = async (userId: string) => {
    return await executeByPlaceholders(
        "SELECT log.*, `employments`.`name` AS `employment_name` FROM `log` LEFT JOIN `employments` ON `log`.`employment_id` = `employments`.`id` WHERE log.`user_id` = :userId AND `employments`.`user_id` = :userId",
        { userId: userId }
    );
};
export const readLogShiftByUserIdAndShiftId = async (
    userId: string,
    shiftId: string
) => {
    return await executeByArray(
        "SELECT * FROM `log` WHERE `user_id` = ? AND `id` = ?",
        [userId, shiftId]
    );
};

export const createLogShift = async (userId: string, shift: LogShift) => {
    return await executeByArray(
        "INSERT INTO `log` (`user_id`, `employment_id`, `date`, `start`, `planned_end`, `actual_end`, `from`, `planned_to`,`actual_to`, `type`, `overrun_type`, `pay_id_override`, `pay_date`, `pay_month`, `pay_financial_year`, `toil`, `flat`, `lower_rate`, `time_and_half`, `higher_rate`, `double`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
            userId,
            shift.employment_id,
            shift.date,
            shift.start,
            shift.planned_end,
            shift.actual_end,
            shift.from,
            shift.actual_to,
            shift.planned_to,
            shift.type,
            shift.overrun_type,
            shift.pay_id_override,
            shift.pay_date,
            shift.pay_month,
            shift.pay_financial_year,
            shift.toil,
            shift.flat,
            shift.lower_rate,
            shift.time_and_half,
            shift.higher_rate,
            shift.double,
        ]
    );
};
export const updateLogShiftByUserIdAndShiftId = async (
    userId: string,
    shift: LogShift
) => {
    return await executeByArray(
        "UPDATE `log` SET `employment_id` = ?, `date` = ?, `start` = ?, `planned_end` = ?, `actual_end` = ?, `from` = ?, `planned_to` = ?,`actual_to` = ?, `type` = ?, `overrun_type` = ?, `pay_id_override` = ?, `pay_date` = ?, `pay_month` = ?, `pay_financial_year` = ?, `toil` = ?, `flat` = ?, `lower_rate` = ?, `time_and_half` = ?, `higher_rate` = ?, `double` = ? WHERE `user_id` = ? AND `id` = ?",
        [
            shift.employment_id,
            shift.date,
            shift.start,
            shift.planned_end,
            shift.actual_end,
            shift.from,
            shift.actual_to,
            shift.planned_to,
            shift.type,
            shift.overrun_type,
            shift.pay_id_override,
            shift.pay_date,
            shift.pay_month,
            shift.pay_financial_year,
            shift.toil,
            shift.flat,
            shift.lower_rate,
            shift.time_and_half,
            shift.higher_rate,
            shift.double,
            userId,
            shift.id,
        ]
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
