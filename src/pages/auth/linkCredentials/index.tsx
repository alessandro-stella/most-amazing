import Button from "components/Button";
import InputField from "components/InputField";
import AuthTemplate from "components/auth/AuthTemplate";
import { useEffect, useState } from "react";
import useTimeout from "utils/hooks/useTimeout";

export default function LinkCredentials() {
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
                body: JSON.stringify({ email, method: "linkCredentials" }),
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
        <AuthTemplate title="Link Credentials">
            <div className="text-center text-4xl font-bold">
                Credentials not linked
            </div>
            <div>
                There appears to be an account registered with this email using
                third-party services that does not currently have a password. If
                you want to set a password, enter your email again to confirm, a
                message will be sent to your address containing the information
                necessary to complete the process
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
