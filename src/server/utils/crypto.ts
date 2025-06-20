import crypto from "crypto";

export const createSalt = () => crypto.randomBytes(32).toString("base64");

export const createToken = () => crypto.randomBytes(48).toString("base64");

export const createHash = (plainText: string, salt: string) =>
    crypto.pbkdf2Sync(plainText, salt, 210000, 64, "sha512").toString("hex");

export const createHashSaltPair = (
    type: "password" | "token" = "password",
    plainText: string | null = null
) => {
    const salt = createSalt();
    let token: string | null = null;
    let hash: string | null = null;
    let selector: string | null = null;
    if (type === "password") {
        if (plainText) {
            hash = createHash(plainText, salt);
        } else {
            throw new Error(
                "plainText argument must be string to create a hash-salt pair"
            );
        }
    } else if (type === "token") {
        token = createToken();
        hash = createHash(token, salt);
        selector = crypto.randomBytes(48).toString("base64");
    } else {
        throw new Error("type argument must equal password or token");
    }
    return {
        salt,
        hash,
        ...(type === "token" && selector
            ? {
                  selector,
                  base64Selector: btoa(selector),
              }
            : {}),
        ...(type === "token" && token
            ? { token, base64Token: btoa(token) }
            : {}),
    };
};
const validateHash = (plainText: string, hash: string, salt: string) =>
    hash === createHash(plainText, salt);
export default validateHash;
