import Button from "components/Button";
import InputField from "components/InputField";
import AuthTemplate from "components/auth/AuthTemplate";
import ProviderButtons from "components/auth/ProviderButtons";
import type { GetServerSideProps } from "next";
import type { Provider } from "next-auth/providers";
import { getProviders } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useTimeout from "utils/hooks/useTimeout";
import { getServerAuthSession } from "~/server/auth";

export default function Login({ providers }: { providers: Provider[] }) {
    const router = useRouter();

    const [email, setEmail] = useState("alessandro.stella2004@gmail.com");
    const [password, setPassword] = useState("asddsa");

    const [emailError, setEmailError] = useState<string[]>([]);
    const [passwordError, setPasswordError] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [startTimeout, setStartTimeout] = useState(false);

    function resetErrors() {
        setEmailError([]);
        setPasswordError([]);

        setStartTimeout(false);
    }

    useTimeout(() => resetErrors(), startTimeout ? 5000 : 0);

    useEffect(() => {
        if (emailError.length === 0 && passwordError.length === 0) {
            setStartTimeout(false);

            return;
        }

        setStartTimeout(true);
    }, [emailError, passwordError]);

    async function handleLogin() {
        resetErrors();
        setIsLoading(true);

        const response = (await fetch("/api/auth/credentials/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
        }).then((res) => res.json())) as {
            success: boolean;
            error: string | false;
        };

        if (response.success) {
            await router.push("/auth/profile");
            return;
        }

        setIsLoading(false);

        if (typeof response.error === "string") {
            switch (response.error) {
                case "User not registered":
                    setEmailError([response.error]);
                    break;

                case "Invalid email":
                    setEmailError([response.error]);
                    break;

                case "Wrong password":
                    setPasswordError([response.error]);
                    break;

                case "Credentials not linked":
                    await router.push("/auth/linkCredentials");
                    return;

                default:
                    break;
            }
        }
    }

    return (
        <AuthTemplate title="Login">
            <div className="text-center text-4xl font-bold">Login</div>

            <div className="flex flex-col">
                <InputField
                    type="email"
                    label="Email"
                    value={email}
                    setValue={setEmail}
                    isDisabled={isLoading}
                    error={emailError}
                />

                <div className="h-6" />

                <InputField
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    value={password}
                    setValue={setPassword}
                    isDisabled={isLoading}
                    isShown={showPassword}
                    setIsShown={setShowPassword}
                    error={passwordError}
                />

                <Link
                    href="/auth/resetPassword"
                    className="text-mint-800 underline hover:text-mint-700">
                    Forgot password?
                </Link>

                <div className="h-6" />

                <Button
                    color="mint"
                    size="lg"
                    isLoading={isLoading}
                    onClick={() => void handleLogin()}>
                    LOGIN
                </Button>

                <div className="h-3" />

                <ProviderButtons providers={providers} />

                <div className="h-3" />

                <div>
                    Are you new here?{" "}
                    <Link
                        href="/auth/register"
                        className="text-mint-800 underline hover:text-mint-700">
                        Register
                    </Link>
                </div>
            </div>
        </AuthTemplate>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);

    if (session && session.user) {
        return {
            redirect: {
                destination: "/auth/profile",
                permanent: false,
            },
        };
    }

    return {
        props: {
            providers: await getProviders(),
        },
    };
};
