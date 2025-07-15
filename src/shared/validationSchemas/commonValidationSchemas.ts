import { z } from "zod";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const shiftDateValidationSchema = (fieldName: string = "Field") => {
    const message = `${fieldName} must be a valid date in the format YYYY-MM-DD`;
    return z
        .string(message)
        .refine((val) => dayjs(val, "YYYY-MM-DD", true).isValid(), {
            message,
        });
};

export const shiftPayMonthValidationSchema = (fieldName: string = "Field") => {
    const message = `${fieldName} must be a valid date in the format YY-MM`;
    return z
        .string(message)
        .refine((val) => dayjs(val, "YY-MM", true).isValid(), {
            message,
        });
};

export const shiftDateTimeValidationSchema = (fieldName: string = "Field") => {
    const message = `${fieldName} must be a valid date in the format YYYY-MM-DD HH:mm:ss`;
    return z
        .string(message)
        .refine((val) => dayjs(val, "YYYY-MM-DD HH:mm:ss", true).isValid(), {
            message,
        });
};

export const shiftTimeValidationSchema = (fieldName: string = "Field") => {
    const message = `${fieldName} must be a valid date in the format HH:mm or HH:mm:ss`;
    return z
        .string(message)
        .refine((val) => dayjs(val, ["HH:mm:ss", "HH:mm"], true).isValid(), {
            message,
        });
};

export const shiftDurationIntValidationSchema = (
    fieldName: string = "Field"
) => {
    const msg = `${fieldName} must be less than 24 hours in ms`;
    return z.coerce.number(msg).int(msg).min(0, msg).max(8.64e7, msg);
};

export const rowIdValidationSchema = (fieldName: string = "ID") => {
    const msg = `${fieldName} must be a valid ID`;
    return z.coerce.number(msg).int(msg).min(0, msg);
};
