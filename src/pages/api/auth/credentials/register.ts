import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import url from "rootUrl";
import createSession from "utils/functions/createSession";
import { getSessionCookie } from "utils/functions/getSessionCookie";
import hashPassword from "utils/functions/hashPassword";
import sendEmail from "utils/functions/sendEmail";
import PasswordValidator from "utils/inputValidators/passwordValidator";
import RegistrationValidator from "utils/inputValidators/registrationValidator";
import { ZodError } from "zod";
import { prisma } from "~/server/db";

export default async function register(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { username, email } = RegistrationValidator.parse(
            JSON.parse(req.body as string)
        );

        const { password } = PasswordValidator.parse(
            JSON.parse(req.body as string)
        );

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                name: username,
                email,
                credentials: {
                    create: { password: hashedPassword },
                },
                cart: {
                    create: {},
                },
            },
        });

        const newSession = await createSession(newUser);

        console.log("Registering...");

        await sendEmail({
            email,
            subject: "Welcome to Amazing!",
            body: `Welcome ${username}! We're glad you're joining us, and we wish the best experience for you on our site! <a href="${url}">Visit Amazing<a/a>`,
        });

        res.setHeader("Set-Cookie", getSessionCookie(newSession));

        return res.status(200).json({ success: true, error: false });
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({
                success: false,
                error: JSON.stringify(e.flatten().fieldErrors),
            });
        }

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                // Unique Constraint Violation
                return res
                    .status(400)
                    .json({ success: false, error: "User already registered" });
            }
        }

        return res.status(400).json({
            success: false,
            error: "Error during registration",
        });
    }
}
