import { executeReadByArray, executeWriteByArray } from "../utils/db";

export const createSecurityToken = async (
    userId: string,
    selector: string,
    hash: string,
    salt: string,
    expiresAt: string | null
) => {
    return await executeWriteByArray(
        "INSERT INTO `security_tokens` VALUES (?,?,?,?,?)",
        [userId, selector, hash, salt, expiresAt]
    );
};
export const readSecurityTokenBySelector = async (selector: string) => {
    return await executeReadByArray(
        "SELECT * FROM `security_tokens` WHERE `selector` = ?",
        [selector]
    );
};

export const deleteSecurityTokensByUserId = async (userId: string) => {
    return await executeWriteByArray(
        "DELETE FROM `security_tokens` WHERE `user_id` = ?",
        [userId]
    );
};
export const deleteExpiredSecurityTokensByUserId = async (userId: string) => {
    return await executeWriteByArray(
        "DELETE FROM `security_tokens` WHERE `user_id` = ? AND `expires_at` <= NOW()",
        [userId]
    );
};
