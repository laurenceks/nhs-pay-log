import { NextFunction, Request, Response } from "express";
import { sendErrorRes } from "../utils/sendRes";
import { ZodType } from "zod";

export const validateRequest = (
    schema: ZodType,
    key: "body" | "cookies" | "headers" | "params" | "query" = "body"
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationResult = schema.safeParse(req[key]);

            if (validationResult.success) {
                next();
            } else {
                sendErrorRes(res, "validationError", {
                    title: "Invalid value",
                    message: validationResult.error.issues
                        .map((i) => i.message)
                        .join("\n"),
                });
            }
        } catch (e) {
            console.log(e);
            sendErrorRes(res, "validationError", {
                title: "Invalid value",
                message: `Unable to validate request ${key}`,
            });
        }
    };
};
