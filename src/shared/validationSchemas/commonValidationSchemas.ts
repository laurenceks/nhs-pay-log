import { z } from "zod";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const shiftDateZodSchema = z
    .string()
    .refine((val) => dayjs(val, "YYYY-MM-DD", true).isValid(), {
        message: "Must be a valid date in the format YYYY-MM-DD",
    });

export const shiftDateTimeZodSchema = z
    .string()
    .refine((val) => dayjs(val, "YYYY-MM-DD HH:mm:ss", true).isValid(), {
        message: "Must be a valid datetime in the format YYYY-MM-DD HH:mm:ss",
    });

export const shiftTimeZodSchema = z
    .string()
    .refine((val) => dayjs(val, ["HH:mm:ss", "HH:mm"], true).isValid(), {
        message: "Must be a valid time in the format HH:mm",
    });

export const shiftDurationIntZodSchema = z.coerce
    .number()
    .int()
    .min(0, "Must be at least 0")
    .max(8.64e7, "Must be less than 24 hours in ms");

export const rowIdZodSchema = z.coerce.number().int().min(0);

export const registerZodSchema = z
    .object({
        email: z.string().email("Enter a valid email address"),
        password1: z
            .string()
            .min(8)
            .refine(
                (val) =>
                    /[a-z]/.test(val) &&
                    /[A-Z]/.test(val) &&
                    /[0-9]/.test(val) &&
                    /[^a-zA-Z0-9]/.test(val),
                {
                    message:
                        "Password must be at least eight characters with at least one lowercase, uppercase, number and symbol",
                }
            ),
        password2: z.string(),
        pay_group_id: z
            .string()
            .regex(/band_\d[a-d]?_\d/, "A pay band must be selected"),
        contract_name: z.string().min(1, "A contract name must be entered"),
        employment_name: z
            .string()
            .min(1, "An employment name must be entered"),
        employment_from: z
            .string()
            .refine(
                (val) =>
                    dayjs(val, "YYYY-MM-DD", true).isValid() &&
                    dayjs(val).isBefore(dayjs().add(1, "day")),
                {
                    message: "An employment must be from today or earlier",
                }
            ),
        weekly_hours: z.coerce
            .number()
            .min(0)
            .max(37.5, "Weekly hours must be a number between 0 and 37.5"),
    })
    .refine((data) => data.password1 === data.password2, {
        path: ["password2"],
        message: "Passwords must match",
    });

export const forgotZodSchema = z
    .object({
        email: registerZodSchema.shape.email,
        newPassword1: registerZodSchema.shape.password1,
        newPassword2: z.string(),
    })
    .refine((data) => data.newPassword1 === data.newPassword2, {
        path: ["newPassword2"],
        message: "Passwords must match",
    });

export const logShiftZodSchema = z.object({
    shiftId: rowIdZodSchema,
    id: rowIdZodSchema,
    date: shiftDateZodSchema,
    pay_date: shiftDateZodSchema,
    from: shiftDateTimeZodSchema,
    actual_to: shiftDateTimeZodSchema,
    planned_to: shiftDateTimeZodSchema,
    toil: shiftDurationIntZodSchema,
    flat: shiftDurationIntZodSchema,
    lower_rate: shiftDurationIntZodSchema,
    time_and_half: shiftDurationIntZodSchema,
    higher_rate: shiftDurationIntZodSchema,
    double: shiftDurationIntZodSchema,
    start: shiftTimeZodSchema,
    actual_end: shiftTimeZodSchema,
    planned_end: shiftTimeZodSchema,
    contract_id: rowIdZodSchema,
    employment_id: rowIdZodSchema,
    extras_ids_string: z
        .string()
        .regex(/^(\d+(,\d+)*)?$/, {
            message: "Extras IDs must be a comma-separated list of numbers",
        })
        .optional(),
    type: z.enum([
        "Normal",
        "OT",
        "Bank",
        "TOIL",
        "AL",
        "AL (relief)",
        "Absent (TOIL)",
        "Absent (TOIL relief)",
        "Sick",
    ]),
    overrun_type: z.enum(["OT", "TOIL"]),
    pay_financial_year: z
        .string()
        .regex(/\d{2}-\d{2}/, "Pay financial year must be in the format YY-YY"),
    pay_id_override: z
        .union([
            z.string().regex(/band_\d[a-d]?_\d/, "Invalid pay override ID"),
            z.literal("null"),
        ])
        .optional(),
    pay_month: z.string().refine((val) => dayjs(val, "YY-MM", true).isValid(), {
        message: "Pay month must be a valid date in the format YY-MM",
    }),
});
