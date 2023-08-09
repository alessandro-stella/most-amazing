import AuthTemplate from "components/auth/AuthTemplate";
import { useRouter } from "next/router";

export default function InvalidLink() {
    const router = useRouter();

    async function navigateHome() {
        await router.push("/");
    }

    return (
        <AuthTemplate title="Invalid Link">
            <div className="flex h-fit w-5/6 flex-col justify-center  gap-8 rounded-md bg-white p-8">
                <div className="text-center text-4xl font-bold">
                    Reset Password
                </div>
                <div className="text-center text-xl">
                    The link you&apos;re trying to use is expired or invalid!
                </div>

                <button
                    onClick={() => 
                        void navigateHome()
                    }>
                    GO BACK
                </button>
            </div>
        </AuthTemplate>
    );
}
