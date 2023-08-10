import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";
import createSession from "utils/functions/createSession";
import { getSessionCookie } from "utils/functions/getSessionCookie";
import { ZodError, z } from "zod";
import { prisma } from "~/server/db";

export default async function login(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        z.object({
            email: z.string().email(),
        }).parse(JSON.parse(req.body as string));
    } catch (e) {
        if (e instanceof ZodError) {
            return res
                .status(400)
                .json({ success: false, error: "Invalid email" });
        }
    }

    const { email, password } = JSON.parse(req.body as string) as {
        email: string;
        password: string;
    };

    const user = await prisma.user.findUnique({
        where: { email: email },
        include: { credentials: true },
    });

    if (!user) {
        return res
            .status(400)
            .json({ success: false, error: "User not registered" });
    }

    if (!user.credentials) {
        return res
            .status(400)
            .json({ success: false, error: "Credentials not linked" });
    }

    const isSamePassword = await bcrypt.compare(
        password,
        user.credentials.password
    );

    if (!isSamePassword) {
        return res
            .status(400)
            .json({ success: false, error: "Wrong password" });
    }

    const newSession = await createSession(user);

    res.setHeader("Set-Cookie", getSessionCookie(newSession));

    return res.status(200).json({
        success: true,
        error: false,
    });
}
