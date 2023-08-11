import type { User } from "@prisma/client";
import Button from "components/Button";
import InputField from "components/InputField";
import AuthTemplate from "components/auth/AuthTemplate";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useTimeout from "utils/hooks/useTimeout";
import { prisma } from "~/server/db";

export default function LinkCredentialsWithCode({ user }: { user: User }) {
    const router = useRouter();

    const [password, setPassword] = useState("Pasquetta123");
    const [confirmPassword, setConfirmPassword] = useState("Pasquetta123");

    const [passwordError, setPasswordError] = useState<string[]>([]);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string[]>(
        []
    );

    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [startTimeout, setStartTimeout] = useState(false);

    async function navigateLogin() {
        await router.push("/auth/login");
    }

    function resetErrors() {
        setPasswordError([]);
        setConfirmPasswordError([]);

        setStartTimeout(false);
    }

    useTimeout(() => resetErrors(), startTimeout ? 5000 : 0);

    useEffect(() => {
        if (passwordError.length === 0 && confirmPasswordError.length === 0) {
            setStartTimeout(false);

            return;
        }

        setStartTimeout(true);
    }, [passwordError, confirmPasswordError]);

    async function handleSubmit() {
        setIsLoading(true);

        const response = (await fetch("/api/auth/credentials/linkCredentials", {
            method: "POST",
            body: JSON.stringify({
                userId: user.id,
                password,
                confirmPassword,
            }),
        }).then((res) => res.json())) as {
            success: boolean;
            error: string | false;
        };

        setIsLoading(false);

        if (response.success) {
            setSuccess(true);
            return;
        }

        if (typeof response.error === "string") {
            switch (response.error) {
                case "This user does not exists":
                    setGeneralError(response.error);
                    break;

                case "This user has already some credentials linked":
                    setGeneralError(response.error);
                    break;

                case "There's been an error during the process":
                    setGeneralError(response.error);
                    break;

                default:
                    {
                        const errorObject = JSON.parse(response.error) as {
                            password?: string[];
                            confirmPassword?: string[];
                        };

                        for (const [key, value] of Object.entries(
                            errorObject
                        )) {
                            switch (key) {
                                case "password":
                                    value[value.indexOf("Invalid")] =
                                        "The password does not meet the required format";
                                    setPasswordError(value.reverse());
                                    break;

                                case "confirmPassword":
                                    value[value.indexOf("Invalid")] =
                                        "The password does not meet the required format";
                                    setConfirmPasswordError(value.reverse());
                                    break;

                                default:
                                    break;
                            }
                        }
                    }
                    break;
            }
        }
    }

    return (
        <AuthTemplate title="Link Credentials">
            <div className="text-center text-4xl font-bold">
                Link Credentials
            </div>

            <div className="flex flex-col gap-4">
                <InputField
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    value={password}
                    setValue={setPassword}
                    isDisabled={isLoading || success || generalError !== ""}
                    isShown={showPassword}
                    setIsShown={setShowPassword}
                    error={passwordError}
                />

                <InputField
                    type={showPassword ? "text" : "password"}
                    label="Confirm password"
                    value={confirmPassword}
                    setValue={setConfirmPassword}
                    isDisabled={isLoading || success || generalError !== ""}
                    isShown={showPassword}
                    setIsShown={setShowPassword}
                    error={confirmPasswordError}
                />

                {success && (
                    <div className="text-mint-600">
                        Password linked successfully!
                    </div>
                )}

                {generalError && (
                    <div className="text-red-500">{generalError}</div>
                )}
            </div>

            {success || generalError !== "" ? (
                <Button
                    color="mint"
                    size="lg"
                    onClick={() => void navigateLogin()}>
                    go back
                </Button>
            ) : (
                <Button
                    color="mint"
                    size="lg"
                    isLoading={isLoading}
                    onClick={() => void handleSubmit()}>
                    link password
                </Button>
            )}
        </AuthTemplate>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const verificationCode = ctx.query.verificationCode as string;

    const userQuery = await prisma.linkingCredentials.findUnique({
        where: { id: verificationCode },
        include: { user: true },
    });

    if (userQuery) {
        if (isCodeExpired(userQuery.expires)) {
            await prisma.linkingCredentials.delete({
                where: { id: verificationCode },
            });

            return {
                redirect: {
                    destination: "/auth/invalidLink",
                    permanent: false,
                },
            };
        }

        if (userQuery.user) {
            return {
                props: {
                    user: userQuery.user,
                },
            };
        }
    }

    return {
        redirect: {
            destination: "/auth/invalidLink",
            permanent: false,
        },
    };
};

const isCodeExpired = (dateTimeString: Date) =>
    new Date() >= new Date(dateTimeString);
