import { createTransport } from "nodemailer";
import { configDotenv } from "dotenv";
import path from "node:path";
import { resolvedDirname } from "./dirname";

// load dot env variables here as well as entry point due to hoisting
configDotenv({
    path: path.resolve(resolvedDirname, "./../.env"),
    override: false,
});

if (!process.env.NODE_ENV) {
    // if unresolved try server path
    configDotenv({
        path: path.resolve(resolvedDirname, "./.env"),
        override: true,
    });
}

export const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT === "465",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});
