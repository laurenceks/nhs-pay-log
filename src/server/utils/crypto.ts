import crypto from "crypto";
import { formatDate } from "../../shared/utils/formatDates";
import { createVerification } from "../crud/verificationCrud";

export const createSalt = () => crypto.randomBytes(32).toString("hex");

export const createToken = () => crypto.randomBytes(48).toString("hex");

export const createHash = (plainText: string, salt: string) =>
    crypto.pbkdf2Sync(plainText, salt, 210000, 64, "sha512").toString("hex");

export const createHashSaltPair = (plainText: string) => {
    const salt = createSalt();
    return {
        salt,
        hash: createHash(plainText, salt),
    };
};
export const createTokenSelector = async (
    userId: string,
    expiresInSeconds: number | null = 86400,
    route: string = "verify"
) => {
    const token = createToken();
    console.log("New token:");
    console.log(token);
    const { hash, salt } = createHashSaltPair(token);
    const selector = createToken();
    const expiresAt = expiresInSeconds
        ? formatDate(
              new Date().setTime(
                  new Date().getTime() + 1000 * expiresInSeconds
              ),
              "yyyy-mm-dd hh:mm:ss"
          )
        : null;

    await createVerification(userId, selector, hash, salt, expiresAt);

    return {
        salt,
        hash,
        selector,
        token,
        expiresAt,
        url: `http${process.env.NODE_ENV === "development" ? "" : "s"}://${
            process.env.DOMAIN
        }/${route}?selector=${encodeURIComponent(selector)}&token=${encodeURIComponent(token)}`,
    };
};
export const validateHash = (plainText: string, hash: string, salt: string) =>
    hash === createHash(plainText, salt);
