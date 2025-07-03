import { executeWriteByArray } from "../utils/db";

export const createLogExtra = async (
    shiftId: string | number,
    extraId: string
) => {
    return await executeWriteByArray("INSERT INTO `log_extras` VALUES (?, ?)", [
        shiftId,
        extraId,
    ]);
};
export const deleteLogExtraByShiftId = async (shiftId: string) => {
    return await executeWriteByArray(
        "DELETE FROM `log_extras` WHERE `log_id` = ?",
        [shiftId]
    );
};
