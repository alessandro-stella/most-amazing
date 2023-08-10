import Button from "components/Button";
import AuthTemplate from "components/auth/AuthTemplate";
import { useRouter } from "next/router";

export default function InvalidLink() {
    const router = useRouter();

    async function navigateHome() {
        await router.push("/");
    }

    return (
        <AuthTemplate title="Invalid Link">
            <div className="text-center text-4xl font-bold">Invalid Link</div>

            <div className="text-center text-xl">
                The link you&apos;re trying to use is expired or invalid!
            </div>

            <Button color="mint" size="lg" onClick={() => void navigateHome()}>
                go back
            </Button>
        </AuthTemplate>
    );
}
