import { ConnectionOptions, createPool } from "mysql2/promise";
import { configDotenv } from "dotenv";
import path from "node:path";
import { dirname } from "dirname-filename-esm";

// load dot env variables here as well as entry point due to hoisting
configDotenv({
    path: path.resolve(dirname(import.meta), "./../.env"),
    override: false,
});
export const dbOptions: ConnectionOptions = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    namedPlaceholders: true,
    /*typeCast: (field, next) =>
        field.type === "DATE" ? field.string() : next(),*/
};

export const pool = createPool(dbOptions);
