import { Schema } from "express-validator";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
export const shiftDateSchema = (
    fieldName: string,
    messageName?: string
): Schema => {
    return {
        [fieldName]: {
            notEmpty: true,
            custom: {
                options: (val) => dayjs(val, "YYYY-MM-DD", true).isValid(),
            },
            errorMessage: `${messageName || fieldName} must be a valid date in the format YYYY-MM-DD`,
        },
    };
};
export const shiftDateTimeSchema = (
    fieldName: string,
    messageName?: string
): Schema => {
    return {
        [fieldName]: {
            notEmpty: true,
            custom: {
                options: (val) =>
                    dayjs(val, "YYYY-MM-DD HH:mm:ss", true).isValid(),
            },
            errorMessage: `${messageName || fieldName} must be a valid datetime in the format YYYY-MM-DD HH:mm:ss`,
        },
    };
};
export const shiftTimeSchema = (
    fieldName: string,
    messageName?: string
): Schema => {
    return {
        [fieldName]: {
            notEmpty: true,
            custom: {
                options: (val) =>
                    dayjs(val, ["HH:mm:ss", "HH:mm"], true).isValid(),
            },
            errorMessage: `${messageName || fieldName} must be a valid time in the format HH:mm`,
        },
    };
};
export const shiftPayMonthSchema = (
    fieldName: string,
    messageName?: string
): Schema => {
    return {
        [fieldName]: {
            notEmpty: true,
            custom: {
                options: (val) => dayjs(val, "YY-MM", true).isValid(),
            },
            errorMessage: `${messageName || fieldName} must be a valid date in the format YY-MM`,
        },
    };
};
export const shiftDurationIntSchema = (
    fieldName: string,
    messageName?: string
): Schema => {
    return {
        [fieldName]: {
            notEmpty: true,
            isInt: {
                options: {
                    min: 0,
                    max: 8.64e7, //24hrs
                },
            },
            errorMessage: `${messageName || fieldName} must be a valid duration between 0 and 24hrs in ms`,
        },
    };
};
export const rowIdValidationSchema = (
    fieldName: string,
    messageName?: string
): Schema => {
    return {
        [fieldName]: {
            notEmpty: true,
            isInt: {
                options: {
                    min: 0,
                },
            },
            errorMessage: `${messageName || fieldName} must be a valid ID`,
        },
    };
};

export const loginValidationSchema: Schema = {
    email: { exists: true, notEmpty: true },
    password: { exists: true, notEmpty: true },
};
export const registerValidationSchema: Schema = {
    email: {
        isEmail: true,
        trim: true,
        notEmpty: true,
        errorMessage: "Enter a valid email address",
    },
    password1: {
        isStrongPassword: true,
        trim: true,
        notEmpty: true,
        errorMessage:
            "Password must be at least eight characters of at least one lowercase, uppercase, number and symbol",
    },
    password2: {
        custom: {
            options: (val, { req }) => {
                return val === req.body.password1;
            },
        },
        errorMessage: "Passwords must match",
    },
    pay_group_id: {
        notEmpty: true,
        matches: { options: /band_\d[a-d]?_\d/ },
        errorMessage: "A pay band must be selected",
    },
    contract_name: {
        notEmpty: true,
        trim: true,
        errorMessage: "A contract name must be entered",
    },
    employment_name: {
        notEmpty: true,
        trim: true,
        errorMessage: "An employment name must be entered",
    },
    employment_from: {
        notEmpty: true,
        isBefore: {
            options: new Date(new Date().setDate(new Date().getDate() + 1))
                .toISOString()
                .split("T")[0],
            errorMessage: "An employment must be from today or earlier",
        },
    },
    weekly_hours: {
        notEmpty: true,
        isFloat: { options: { min: 0, max: 37.5 } },
        toFloat: true,
        errorMessage: "Weekly hours must be a number between 0 and 37.5",
    },
};

export const forgotValidationSchema: Schema = {
    email: { ...registerValidationSchema.email },
    newPassword1: { ...registerValidationSchema.password1 },
    newPassword2: {
        custom: {
            options: (val, { req }) => {
                return val === req.body.newPassword1;
            },
        },
        errorMessage: "Passwords must match",
    },
};

export const logShiftValidationSchema: Schema = {
    ...rowIdValidationSchema("shiftId", "Shift ID"),
    ...rowIdValidationSchema("id", "Shift ID"),
    ...shiftDateSchema("date", "Date"),
    ...shiftDateSchema("pay_date", "Pay date"),
    ...shiftDateTimeSchema("from", "From"),
    ...shiftDateTimeSchema("actual_to", "Actual to"),
    ...shiftDateTimeSchema("planned_to", "Planned to"),
    ...shiftDurationIntSchema("toil", "TOIL"),
    ...shiftDurationIntSchema("flat", "Flat"),
    ...shiftDurationIntSchema("lower_rate", "Lower rate"),
    ...shiftDurationIntSchema("time_and_half", "Time and half"),
    ...shiftDurationIntSchema("higher_rate", "Higher rate"),
    ...shiftDurationIntSchema("double", "Double"),
    ...shiftTimeSchema("start", "Start"),
    ...shiftTimeSchema("actual_end", "Actual end"),
    ...shiftTimeSchema("planned_end", "Planned end"),
    ...rowIdValidationSchema("contract_id", "Contract ID"),
    ...rowIdValidationSchema("employment_id", "Employment ID"),
    extras_ids_string: {
        notEmpty: false,
        matches: { options: /^(\d+(,\d+)*)?$/ },
        errorMessage: "Extras IDs string must be a comma-delimited list of IDs",
    },
    type: {
        isIn: {
            options: [
                [
                    "Normal",
                    "OT",
                    "Bank",
                    "TOIL",
                    "AL",
                    "AL (relief)",
                    "Absent (TOIL)",
                    "Absent (TOIL relief)",
                    "Sick",
                ],
            ],
        },
        errorMessage: "Invalid shift type",
    },
    overrun_type: {
        isIn: {
            options: [["OT", "TOIL"]],
            errorMessage: "Invalid shift overrun type",
        },
    },
    pay_financial_year: {
        notEmpty: true,
        matches: { options: /\d{2}-\d{2}/ },
        errorMessage: `Pay financial year must be in the format YY-YY`,
    },
    pay_id_override: {
        matches: { options: /band_\d[a-d]?_\d/ },
        errorMessage: "Invalid pay override ID",
        optional: { options: { values: "null" } },
    },
    ...shiftPayMonthSchema("pay_month", "Pay month"),
    ...shiftPayMonthSchema("flowers_pay_month", "Flowers pay month"),
};

export const {
    id: _id,
    shiftId: _shiftId,
    ...newLogShiftValidationSchema
} = logShiftValidationSchema;
