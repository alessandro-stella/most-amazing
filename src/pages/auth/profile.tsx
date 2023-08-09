import type { User } from "@prisma/client";
import type { GetServerSideProps } from "next";
import { signOut } from "next-auth/react";
import Head from "next/head";
import { getServerAuthSession } from "~/server/auth";

export default function ProfilePage({ user }: { user: User }) {
    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>

        <div className="p-4">
            <div className="text-2xl">Profile</div>
            <div>ID: {user.id}</div>
            <div>Username: {user.name}</div>
            <div>Email: {user.email}</div>
            <div>Image {user.image ?? "NO IMAGE"}</div>

            <button onClick={() => void signOut()}>SIGN OUT</button>
        </div></>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);

    if (session && session.user) {
        return {
            props: {
                user: session.user,
            },
        };
    }

    return {
        redirect: {
            destination: "/auth/signIn",
            permanent: false,
        },
    };
};
