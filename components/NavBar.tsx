import { Context } from "context/Context";
import Image from "next/image";
import { useContext } from "react";

export default function NavBar() {
    const { setSelectedCategory } = useContext(Context);

    function goToHome() {
        setSelectedCategory("");
    }

    return (
        <div className="h-16 w-screen border-b-[1px] border-slate-600 bg-slate-700 p-4">
            <div
                className="relative ml-2 aspect-[4.42/1] h-full"
                onClick={() => void goToHome()}>
                <Image
                    priority={true}
                    src="/fullLogo-white.svg"
                    alt="AMAZING"
                    fill
                />
            </div>
        </div>
    );
}
