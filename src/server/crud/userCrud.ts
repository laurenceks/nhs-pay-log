import { executeReadByArray, executeWriteByArray } from "../utils/db";
import { ApiUser } from "../../../types/commonTypes";

export const createUser = async (
    userId: string,
    email: string,
    hash: string,
    salt: string
) => {
    return await executeWriteByArray(
        "INSERT INTO users (`id`, `email`, `hash`, `salt`) VALUES (?, ?, ?, ?)",
        [userId, email, hash, salt]
    );
};

export const readUserByEmail = async (email: string) => {
    return await executeReadByArray<ApiUser>(
        "SELECT * FROM `users` WHERE `email` = ?",
        [email]
    );
};
export const readUserById = async (id: string) => {
    return await executeReadByArray<ApiUser>(
        "SELECT * FROM `users` WHERE `id` = ?",
        [id]
    );
};

export const updateUserVerificationById = async (id: string) => {
    return await executeWriteByArray(
        "UPDATE `users` SET `verified` = TRUE WHERE `id` = ?",
        [id]
    );
};
export const updateUserPasswordById = async (
    hash: string,
    salt: string,
    id: string
) => {
    return await executeWriteByArray(
        "UPDATE `users` SET `hash` = ?, `salt` = ? WHERE `id` = ?",
        [hash, salt, id]
    );
};
