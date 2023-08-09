import type { Session, User } from "@prisma/client";
import { prisma } from "~/server/db";
import { generateSessionString } from "./generateRandomString";

export default async function createSession(newUser: User): Promise<Session> {
    const expirationDate = new Date();
    const days = expirationDate.getDate();

    expirationDate.setMonth(expirationDate.getMonth() + 1);

    if (expirationDate.getDate() != days) {
        expirationDate.setDate(0);
    }

    await prisma.session.deleteMany({
        where: { userId: newUser.id },
    });

    const newSession = await prisma.session.create({
        data: {
            userId: newUser.id,
            sessionToken: generateSessionString(),
            expires: expirationDate,
        },
    });

    return newSession;
}
