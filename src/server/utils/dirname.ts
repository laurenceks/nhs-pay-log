import { dirname } from "path";
import { fileURLToPath } from "url";

export const resolvedDirname =
    typeof __dirname !== "undefined"
        ? __dirname
        : dirname(fileURLToPath(import.meta.url));
