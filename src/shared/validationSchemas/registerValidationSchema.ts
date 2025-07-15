import { z } from "zod";
import dayjs from "dayjs";

const passwordMessage =
    "Password must be at least eight characters with at least one lowercase, uppercase, number and symbol";
const passwordMatchMessage = "Passwords must match";
const payBandMessage = "A pay band must be selected";
const contractMessage = "A contract name must be entered";
const employmentNameMessage = "An employment name must be entered";
const employmentFromMessage = "An employment must be from today or earlier";
const weeklyHoursMessage = "Weekly hours must be a number between 0 and 37.5";
export const registerValidationSchema = z
    .object({
        email: z.email("Enter a valid email address"),
        password1: z
            .string(passwordMessage)
            .min(8, passwordMessage)
            .refine(
                (val) =>
                    /[a-z]/.test(val) &&
                    /[A-Z]/.test(val) &&
                    /[0-9]/.test(val) &&
                    /[^a-zA-Z0-9]/.test(val),
                {
                    message: passwordMessage,
                }
            ),
        password2: z.string(passwordMatchMessage),
        pay_group_id: z
            .string(payBandMessage)
            .regex(/band_\d[a-d]?_\d/, payBandMessage),
        contract_name: z.string(contractMessage).min(1, contractMessage),
        employment_name: z
            .string(employmentNameMessage)
            .min(1, employmentNameMessage),
        employment_from: z
            .string(employmentFromMessage)
            .refine(
                (val) =>
                    dayjs(val, "YYYY-MM-DD", true).isValid() &&
                    dayjs(val).isBefore(dayjs().add(1, "day")),
                {
                    message: employmentFromMessage,
                }
            ),
        weekly_hours: z.coerce
            .number(weeklyHoursMessage)
            .min(0, weeklyHoursMessage)
            .max(37.5, weeklyHoursMessage),
    })
    .refine((data) => data.password1 === data.password2, {
        path: ["password2"],
        message: passwordMatchMessage,
    });
