import type { NextApiRequest, NextApiResponse } from "next";
import hashPassword from "utils/functions/hashPassword";
import sendEmail from "utils/functions/sendEmail";
import PasswordValidator from "utils/inputValidators/passwordValidator";
import { ZodError } from "zod";
import { prisma } from "~/server/db";

export default async function resetPassword(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { userId, password, confirmPassword } = JSON.parse(
            req.body as string
        ) as {
            userId: string;
            password: string;
            confirmPassword: string;
        };

        PasswordValidator.parse({ password, confirmPassword });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { credentials: true },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "This user does not exists",
            });
        }

        if (!user?.credentials) {
            await prisma.resetPassword.deleteMany({ where: { userId } });

            return res.status(400).json({
                success: false,
                error: "This user does not have credentials linked",
            });
        }

        const hashedPassword = await hashPassword(password);

        try {
            await prisma.credentials.update({
                where: { id: user.credentials.id },
                data: {
                    password: hashedPassword,
                },
            });

            await prisma.resetPassword.deleteMany({ where: { userId } });
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: "There's been an error during the process",
            });
        }

        if (user.email)
            await sendEmail({
                email: user.email,
                subject: "Successful password reset",
                body: `Hi ${user.name}, you successfully changed your password!`,
            });

        return res.status(200).json({ success: true, error: false });
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({
                success: false,
                error: JSON.stringify(e.flatten().fieldErrors),
            });
        }

        return res.status(400).json({
            success: false,
            error: "There's been an error during the process",
        });
    }
}
