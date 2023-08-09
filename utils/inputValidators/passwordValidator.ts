import { z } from "zod";

const PasswordValidator = z
    .object({
        password: z
            .string()
            .min(8)
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
        confirmPassword: z
            .string()
            .min(8)
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "The passwords do not match",
        path: ["confirmPassword"],
    });

export default PasswordValidator;
