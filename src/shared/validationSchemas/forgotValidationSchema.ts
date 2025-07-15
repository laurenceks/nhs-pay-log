import { z } from "zod";
import { registerValidationSchema } from "./registerValidationSchema";

export const forgotValidationSchema = z
    .object({
        email: registerValidationSchema.shape.email,
        newPassword1: registerValidationSchema.shape.password1,
        newPassword2: z.string("Passwords must match"),
    })
    .refine((data) => data.newPassword1 === data.newPassword2, {
        path: ["newPassword2"],
        message: "Passwords must match",
    });
