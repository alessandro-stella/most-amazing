import Waves from "components/auth/Waves";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

interface AuthTemplateProps {
    title: string;
    children: ReactNode;
}

export default function AuthTemplate({ title, children }: AuthTemplateProps) {
    const router = useRouter();

    async function navigateHome() {
        await router.push("/");
    }

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <div className="flex min-h-screen max-w-[100vw] flex-col overflow-x-hidden md:flex-row md:overflow-visible">
                <div className="flex min-w-0 flex-1 items-center justify-center bg-slate-800 md:pl-4">
                    <div className="flex h-full w-5/6 flex-col items-center justify-center gap-8 pt-4 md:pb-4 md:pt-0">
                        <div className="flex w-full flex-1 flex-col items-center justify-center gap-8">
                            <div className="hidden text-2xl text-white md:inline">
                                Welcome to
                            </div>

                            <div
                                className="flex w-1/2 cursor-pointer flex-col items-center md:mb-10"
                                onClick={() => void navigateHome()}>
                                <div className="logo-shadow relative aspect-video w-full">
                                    <Image
                                        style={{
                                            filter: "drop-shadow(0 2px 4px black)",
                                        }}
                                        src="/smallLogo-white.svg"
                                        alt="logo"
                                        fill
                                    />
                                </div>

                                <div className="text-3xl font-bold text-white md:text-5xl">
                                    Amazing
                                </div>
                            </div>

                            <div className="hidden text-center text-sm text-white md:inline">
                                This is a new version of the famous online store
                                project &quot;Amazing&quot;, created by
                                Alessandro Stella to better understand the
                                underlying systems behind a full-stack web
                                application
                            </div>
                        </div>

                        <div className="hidden text-white md:inline">
                            Created by{" "}
                            <span className="font-bold">Alessandro Stella</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-[1.8] flex-col bg-slate-800 md:min-h-screen md:flex-row">
                    <Waves />

                    <div className="flex flex-1 items-center justify-center bg-mint-400 py-4">
                        <div className="flex w-5/6 flex-col justify-center gap-8 rounded-md bg-white p-8">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
