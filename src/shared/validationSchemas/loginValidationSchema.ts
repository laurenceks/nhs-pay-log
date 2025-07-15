import { z } from "zod";

export const loginValidationSchema = z.object({
    email: z.string("Email required").min(1, "Email required"),
    password: z.string("Password required").min(1, "Password required"),
});
