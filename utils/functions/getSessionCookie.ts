import type { Session } from "@prisma/client";
import { serialize } from "cookie";
import { env } from "~/env.mjs";

export function getSessionCookie(session: Session): string {
    return serialize(
        env.NODE_ENV === "development"
            ? "next-auth.session-token"
            : "__Secure-next-auth.session-token",
        session.sessionToken,
        {
            httpOnly: true,
            secure: env.NODE_ENV !== "development",
            expires: session.expires,
            sameSite: "strict",
            path: "/",
        }
    );
}
