import { executeReadByArray, executeWriteByArray } from "../utils/db";
import { randomUUID } from "node:crypto";
import { ApiUser } from "../../../types/commonTypes";

export const createUser = async (email: string, hash: string, salt: string) => {
    return await executeWriteByArray(
        "INSERT INTO users (`id`, `email`, `hash`, `salt`) VALUES (?, ?, ?, ?)",
        [randomUUID(), email, hash, salt]
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
