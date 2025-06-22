import { execute } from "../utils/db";
import { randomUUID } from "node:crypto";

export const createUser = async (email: string, hash: string, salt: string) => {
    await execute(
        "INSERT INTO users (`id`, `email`, `hash`, `salt`) VALUES (?, ?, ?, ?)",
        [randomUUID(), email, hash, salt]
    );
};

export const readUserByEmail = async (email: string) => {
    return await execute("SELECT * FROM `users` WHERE `email` = ?", [email]);
};
export const readUserById = async (id: string) => {
    return await execute("SELECT * FROM `users` WHERE `id` = ?", [id]);
};
