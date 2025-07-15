import { z } from "zod";
import {
    rowIdValidationSchema,
    shiftDateTimeValidationSchema,
    shiftDateValidationSchema,
    shiftDurationIntValidationSchema,
    shiftPayMonthValidationSchema,
    shiftTimeValidationSchema,
} from "./commonValidationSchemas";

export const logShiftValidationSchema = z
    .object({
        id: rowIdValidationSchema(),
        date: shiftDateValidationSchema("Date"),
        pay_date: shiftDateValidationSchema("Pay date"),
        from: shiftDateTimeValidationSchema("From"),
        actual_to: shiftDateTimeValidationSchema("Actual to"),
        planned_to: shiftDateTimeValidationSchema("Planned to"),
        toil: shiftDurationIntValidationSchema("TOIL"),
        flat: shiftDurationIntValidationSchema("Flat"),
        lower_rate: shiftDurationIntValidationSchema("Lower rate"),
        time_and_half: shiftDurationIntValidationSchema("Time and half"),
        higher_rate: shiftDurationIntValidationSchema("Higher rate"),
        double: shiftDurationIntValidationSchema("Double"),
        start: shiftTimeValidationSchema("Start"),
        actual_end: shiftTimeValidationSchema("Actual end"),
        planned_end: shiftTimeValidationSchema("Planned end"),
        contract_id: rowIdValidationSchema("Contract ID"),
        employment_id: rowIdValidationSchema("Employment ID"),
        extras_ids_string: z
            .string("Extras IDs must be a comma-separated list of numbers")
            .regex(/^(\d+(,\d+)*)?$/, {
                message: "Extras IDs must be a comma-separated list of numbers",
            }),
        type: z.enum(
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
            "Invalid Type"
        ),
        overrun_type: z.enum(["OT", "TOIL"], "Invalid overrun type"),
        pay_financial_year: z
            .string("Pay financial year must be in the format YY-YY")
            .regex(
                /\d{2}-\d{2}/,
                "Pay financial year must be in the format YY-YY"
            ),
        pay_id_override: z
            .string("Invalid pay override ID")
            .regex(/band_\d[a-d]?_\d/, "Invalid pay override ID")
            .nullable(),
        pay_month: shiftPayMonthValidationSchema("Pay month"),
        flowers_pay_month: shiftPayMonthValidationSchema("Flowers pay month"),
    })
    .refine(
        (obj) => new Date(obj.actual_to) >= new Date(obj.planned_to),
        "Actual to cannot be before planned to"
    );
export const logShiftIdValidationSchema = z.object({
    shiftId: logShiftValidationSchema.shape.id,
});
