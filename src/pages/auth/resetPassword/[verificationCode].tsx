import type { User } from "@prisma/client";
import Button from "components/Button";
import InputField from "components/InputField";
import AuthTemplate from "components/auth/AuthTemplate";
import type { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import useTimeout from "utils/hooks/useTimeout";
import { prisma } from "~/server/db";

export default function ResetPasswordWithCode({ user }: { user: User }) {
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

        const response = (await fetch("/api/auth/credentials/resetPassword", {
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

                case "This user does not have credentials linked":
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
        <AuthTemplate title="Reset Password">
            <div className="text-center text-4xl font-bold">Reset Password</div>

            <InputField
                type={showPassword ? "text" : "password"}
                label="Password"
                value={password}
                setValue={setPassword}
                isDisabled={isLoading || success}
                isShown={showPassword}
                setIsShown={setShowPassword}
                error={passwordError}
            />

            <InputField
                type={showPassword ? "text" : "password"}
                label="Confirm password"
                value={confirmPassword}
                setValue={setConfirmPassword}
                isDisabled={isLoading || success}
                isShown={showPassword}
                setIsShown={setShowPassword}
                error={confirmPasswordError}
            />

            <Button
                color="mint"
                size="lg"
                isLoading={isLoading}
                onClick={() => void handleSubmit()}>
                RESET PASSWORD
            </Button>

            {isLoading && <div>Loading...</div>}
            {success && <div>Success!</div>}

            {generalError && <div>{generalError}</div>}
        </AuthTemplate>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const verificationCode = ctx.query.verificationCode as string;

    const userQuery = await prisma.resetPassword.findUnique({
        where: { id: verificationCode },
        include: { user: true },
    });

    if (userQuery) {
        if (isCodeExpired(userQuery.expires)) {
            await prisma.resetPassword.delete({
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
