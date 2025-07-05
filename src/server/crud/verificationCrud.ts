import { executeReadByArray, executeWriteByArray } from "../utils/db";

export const createVerification = async (
    userId: string,
    selector: string,
    hash: string,
    salt: string,
    expiresAt: string | null
) => {
    return await executeWriteByArray(
        "INSERT INTO `verification_tokens` VALUES (?,?,?,?,?)",
        [userId, selector, hash, salt, expiresAt]
    );
};
export const readVerificationBySelector = async (selector: string) => {
    return await executeReadByArray(
        "SELECT * FROM `verification_tokens` WHERE `selector` = ?",
        [selector]
    );
};

export const deleteVerificationsByUserId = async (userId: string) => {
    return await executeWriteByArray(
        "DELETE FROM `verification_tokens` WHERE `user_id` = ?",
        [userId]
    );
};
