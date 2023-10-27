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
import { AiOutlineArrowLeft } from "react-icons/ai";
import useTimeout from "utils/hooks/useTimeout";
import RegistrationValidator from "utils/inputValidators/registrationValidator";
import { ZodError } from "zod";
import { getServerAuthSession } from "~/server/auth";

export default function Register({ providers }: { providers: Provider[] }) {
    const router = useRouter();

    const [username, setUsername] = useState("Alessandro Stella");
    const [email, setEmail] = useState("alessandro.stella2004@gmail.com");
    const [confirmEmail, setConfirmEmail] = useState(
        "alessandro.stella2004@gmail.com"
    );
    const [usernameError, setUsernameError] = useState<string[]>([]);
    const [emailError, setEmailError] = useState<string[]>([]);
    const [confirmEmailError, setConfirmEmailError] = useState<string[]>([]);

    const [goToPassword, setGoToPassword] = useState(false);

    const [password, setPassword] = useState("asddsa");
    const [confirmPassword, setConfirmPassword] = useState("asddsa");
    const [passwordError, setPasswordError] = useState<string[]>([]);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string[]>(
        []
    );

    const [isLoading, setIsLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [startTimeout, setStartTimeout] = useState(false);

    function resetErrors() {
        setUsernameError([]);
        setEmailError([]);
        setConfirmEmailError([]);
        setPasswordError([]);
        setConfirmPasswordError([]);

        setStartTimeout(false);
    }

    useTimeout(() => resetErrors(), startTimeout ? 5000 : 0);

    useEffect(() => {
        if (
            usernameError.length === 0 &&
            emailError.length === 0 &&
            confirmEmailError.length === 0 &&
            passwordError.length === 0 &&
            confirmPasswordError.length === 0
        ) {
            setStartTimeout(false);

            return;
        }

        setStartTimeout(true);
    }, [
        usernameError,
        emailError,
        confirmEmailError,
        passwordError,
        confirmPasswordError,
    ]);

    function handleValidatorError(error: string) {
        const errorObject = JSON.parse(error) as {
            username?: string[];
            email?: string[];
            confirmEmail?: string[];
            password?: string[];
            confirmPassword?: string[];
        };

        for (const [key, value] of Object.entries(errorObject)) {
            console.log(value.reverse());

            switch (key) {
                case "username":
                    setGoToPassword(false);
                    setUsernameError(value.reverse());
                    break;

                case "email":
                    setGoToPassword(false);
                    setEmailError(value.reverse());
                    break;

                case "confirmEmail":
                    setGoToPassword(false);
                    setConfirmEmailError(value.reverse());
                    break;

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

    function checkEmail() {
        resetErrors();

        try {
            RegistrationValidator.parse({
                username,
                email,
                confirmEmail,
            });

            setGoToPassword(true);
        } catch (e) {
            if (e instanceof ZodError) {
                handleValidatorError(JSON.stringify(e.flatten().fieldErrors));
            }
        }
    }

    async function handleRegistration() {
        resetErrors();
        setIsLoading(true);

        const response = (await fetch("/api/auth/credentials/register", {
            method: "POST",
            body: JSON.stringify({
                username,
                email,
                confirmEmail,
                password,
                confirmPassword,
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
                case "User already registered":
                    setGoToPassword(false);
                    setEmailError([response.error]);
                    break;

                case "Error during registration":
                    setGoToPassword(false);
                    setUsernameError([response.error]);
                    break;

                default:
                    handleValidatorError(response.error);
                    break;
            }
        }
    }

    return (
        <AuthTemplate title="Register">
            <div className=" text-center text-4xl font-bold">Register</div>

            <div className="flex flex-col gap-6">
                <div
                    className={`flex flex-col gap-6 ${
                        goToPassword ? "hidden" : ""
                    }`}>
                    <InputField
                        type="text"
                        label="Username"
                        value={username}
                        setValue={setUsername}
                        isDisabled={isLoading}
                        error={usernameError}
                    />
                    <InputField
                        type="email"
                        label="Email"
                        value={email}
                        setValue={setEmail}
                        isDisabled={isLoading}
                        error={emailError}
                    />
                    <InputField
                        type="email"
                        label="Confirm email"
                        value={confirmEmail}
                        setValue={setConfirmEmail}
                        isDisabled={isLoading}
                        error={confirmEmailError}
                    />
                </div>

                <div
                    className={`flex flex-col gap-6 ${
                        goToPassword ? "" : "hidden"
                    }`}>
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
                    <InputField
                        type={showPassword ? "text" : "password"}
                        label="Confirm password"
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                        isDisabled={isLoading}
                        isShown={showPassword}
                        setIsShown={setShowPassword}
                        error={confirmPasswordError}
                    />
                </div>

                <div className="flex items-stretch justify-stretch gap-2">
                    <div className={`flex ${goToPassword ? "" : "hidden"}`}>
                        <Button
                            color="mint"
                            size="lg"
                            isIcon={true}
                            isLoading={isLoading}
                            onClick={() => setGoToPassword(false)}>
                            <AiOutlineArrowLeft />
                        </Button>
                    </div>

                    <Button
                        color="mint"
                        size="lg"
                        isLoading={isLoading}
                        onClick={() =>
                            goToPassword
                                ? void handleRegistration()
                                : void checkEmail()
                        }>
                        {goToPassword ? "REGISTER" : "CONFIRM DATA"}
                    </Button>
                </div>

                <ProviderButtons providers={providers} />

                <div>
                    Already one of us?{" "}
                    <Link
                        href="/auth/login"
                        className="text-mint-800 underline hover:text-mint-700">
                        Login
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
