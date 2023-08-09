import Button from "components/Button";
import InputField from "components/InputField";
import AuthTemplate from "components/auth/AuthTemplate";
import { useEffect, useState } from "react";
import useTimeout from "utils/hooks/useTimeout";

export default function ResetPassword() {
    const [email, setEmail] = useState("alessandro.stella2004@gmail.com");
    const [emailSent, setEmailSent] = useState(false);
    const [emailError, setEmailError] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [startTimeout, setStartTimeout] = useState(false);

    useTimeout(() => setEmailError([]), startTimeout ? 5000 : 0);

    useEffect(() => {
        if (emailError.length === 0) {
            setStartTimeout(false);

            return;
        }

        setStartTimeout(true);
    }, [emailError]);

    async function handleSubmit() {
        setEmailError([]);
        setIsLoading(true);

        const response = (await fetch(
            "/api/auth/credentials/sendCredentialEmail",
            {
                method: "POST",
                body: JSON.stringify({ email, method: "resetPassword" }),
            }
        ).then((res) => res.json())) as {
            success: boolean;
            error: string | false;
        };

        setIsLoading(false);

        if (response.success) {
            setEmailSent(true);
            return;
        }

        if (response.error) setEmailError([response.error]);
    }

    return (
        <AuthTemplate title="Reset Password">
            <div className="text-center text-4xl font-bold">Reset Password</div>

            <div>
                Enter your registered email address, and a password reset email
                will be sent to you. Open the email and click on the provided
                link to access the password reset page. Create a strong new
                password and confirm it. Once done, you&apos;ll receive a
                confirmation email. Keep your new password secure, and if you
                encounter any issues, reach out to our support team for
                assistance. Happy logging in!
            </div>

            <InputField
                value={email}
                type="text"
                label="Email"
                isDisabled={isLoading || emailSent}
                setValue={setEmail}
                error={emailError}
            />

            <Button
                color="mint"
                size="lg"
                isLoading={isLoading}
                onClick={() => void handleSubmit()}>
                SEND EMAIL
            </Button>

            {emailSent && (
                <div className="text-green-500">Email sent successfully</div>
            )}
        </AuthTemplate>
    );
}
