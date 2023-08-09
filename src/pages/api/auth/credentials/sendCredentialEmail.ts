import type { NextApiRequest, NextApiResponse } from "next";
import url from "rootUrl";
import sendEmail from "utils/functions/sendEmail";
import { ZodError, z } from "zod";
import { prisma } from "~/server/db";

export default async function linkCredentials(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        z.object({
            email: z.string().email().nonempty(),
        }).parse(JSON.parse(req.body as string));
    } catch (e) {
        if (e instanceof ZodError) {
            return res
                .status(400)
                .json({ success: false, error: "Invalid email" });
        }
    }

    const { email, method } = JSON.parse(req.body as string) as {
        email: string;
        method: string;
    };

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return res
            .status(400)
            .json({ success: false, error: "User does not exists" });
    }

    const recordBody = {
        delete: {
            where: { userId: user.id },
        },
        create: {
            data: {
                userId: user.id,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        },
    };

    const emailData: {
        email: string;
        subject: string;
        body: string;
    } = {
        email,
        subject: "",
        body: "",
    };

    switch (method) {
        case "linkCredentials":
            {
                await prisma.linkingCredentials.deleteMany(recordBody.delete);

                const { id } = await prisma.linkingCredentials.create(
                    recordBody.create
                );

                emailData.subject = "Link credentials";
                emailData.body = `${url}/auth/linkCredentials/${id}`;
            }
            break;

        case "resetPassword":
            {
                await prisma.resetPassword.deleteMany(recordBody.delete);

                const { id } = await prisma.resetPassword.create(
                    recordBody.create
                );

                emailData.subject = "Reset password";
                emailData.body = `${url}/auth/resetPassword/${id}`;
            }
            break;

        default:
            break;
    }

    try {
        await sendEmail(emailData);

        return res.status(200).json({ success: true, error: false });
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: "Error while sending the email",
        });
    }
}
