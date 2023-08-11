import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
    getServerSession,
    type DefaultSession,
    type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import url from "rootUrl";
import sendEmail from "utils/functions/sendEmail";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            // ...other properties
            // role: UserRole;
        } & DefaultSession["user"];
    }

    // interface User {
    //   // ...other properties
    //   // role: UserRole;
    // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    callbacks: {
        session: ({ session, user }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: user.id,
                },
            };
        },
        signIn: async ({ user, account }) => {
            if (account) {
                const dbAccount = await prisma.account.findFirst({
                    where: { providerAccountId: account.providerAccountId },
                    include: { user: true },
                });

                if (dbAccount) {
                    // NextAuth will handle the registration because there's
                    // already a provider account linked to a user

                    return true;
                }

                if (user.email) {
                    const dbUser = await prisma.user.findUnique({
                        where: { email: user.email },
                        include: { accounts: true },
                    });

                    if (!dbUser) {
                        // NextAuth will handle the registration by creating
                        // a new user linked to the new provider account

                        try {
                            await sendEmail({
                                email: user.email,
                                subject: "Welcome to Amazing!",
                                body: `Welcome ${user.name}! We're glad you're joining us, and we wish the best experience for you on our site! <a href="${url}">Visit Amazing<a/a>`,
                            });
                        } catch (e) {
                            return false;
                        }

                        return true;
                    }

                    // If you're using a new provider account to log in and
                    // there's already a user with the same email, we'll create
                    // and link the new account to the existing user

                    try {
                        await prisma.user.update({
                            where: { id: dbUser.id },
                            data: {
                                accounts: {
                                    create: {
                                        ...account,
                                    },
                                },
                            },
                        });

                        return true;
                    } catch (error) {
                        return false;
                    }
                }
            }

            return true;
        },
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        }),
        DiscordProvider({
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
        }),
        /**
         * ...add more providers here.
         *
         * Most other providers require a bit more work than the Discord provider. For example, the
         * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
         * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
         *
         * @see https://next-auth.js.org/providers/github
         */
    ],

    pages: {
        signIn: "/auth/login",
    },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) => {
    return getServerSession(ctx.req, ctx.res, authOptions);
};
