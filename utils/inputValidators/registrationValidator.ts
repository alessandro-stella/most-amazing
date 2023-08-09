import { z } from "zod";

const RegistrationValidator = z
    .object({
        username: z.string().min(3).max(20),
        email: z.string().email(),
        confirmEmail: z.string().email(),
    })
    .refine((data) => data.email === data.confirmEmail, {
        message: "The emails do not match",
        path: ["confirmEmail"],
    });

export default RegistrationValidator;
