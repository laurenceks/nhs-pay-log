import {
    checkSchema,
    Location,
    Schema,
    validationResult,
} from "express-validator";
import { sendErrorRes } from "../utils/sendRes";
import { NextFunction, Request, Response } from "express";

export const validateRequest = (
    schema: Schema,
    defaultLocations?: Location[]
) => {
    const schemaMiddlewares = checkSchema(schema, defaultLocations);
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            for (const middleware of schemaMiddlewares) {
                await new Promise<void>((resolve, reject) => {
                    middleware(req, res, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            }

            const result = validationResult(req);

            if (result.isEmpty()) {
                next();
            } else {
                sendErrorRes(res, "validationError", {
                    title: "Invalid value",
                    message: result
                        .array()
                        .map((x) => x.msg)
                        .join("\n"),
                });
            }
        } catch (err) {
            next(err);
        }
    };
};
