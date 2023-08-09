import Button from "components/Button";
import type { Provider } from "next-auth/providers";
import { signIn } from "next-auth/react";
import type { ReactNode } from "react";
import { BsDiscord, BsGoogle } from "react-icons/bs";

export default function ProviderButtons({
    providers,
}: {
    providers: Provider[];
}) {
    const icons: Record<string, ReactNode> = {
        google: <BsGoogle />,
        discord: <BsDiscord />,
    };

    return (
        <div className="flex w-full gap-4">
            {Object.values(providers).map((provider) => (
                <Button
                    color="provider"
                    size="md"
                    onClick={() => void signIn(provider.id)}
                    key={provider.id}>
                    <div className="flex items-center justify-center gap-2">
                        {icons[provider.id]}
                        {provider.name}
                    </div>
                </Button>
            ))}
        </div>
    );
}
