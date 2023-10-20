import type { ReactNode } from "react";
import { AiOutlineLoading } from "react-icons/ai";

interface ButtonProps {
    children: ReactNode;
    color: "mint" | "provider";
    size: "xl" | "lg" | "md";
    onClick: () => void;
    isLoading?: boolean;
    isIcon?: boolean;
    isDisabled?: boolean;
}

export default function Button({
    children,
    color,
    size,
    onClick,
    isLoading = false,
    isIcon = false,
    isDisabled = false,
}: ButtonProps) {
    const colorVariants = {
        mint: {
            style: "text-white outline-mint-700",
            active: "bg-mint-400 border-mint-400 hover:bg-mint-300 hover:border-mint-300",
            disabled: "bg-mint-300 border-mint-300 pointer-events-none",
        },
        provider: {
            style: "text-mint-600 outline-mint-700",
            active: "bg-transparent border-mint-400 hover:bg-mint-400 hover:text-white",
            disabled: "bg-mint-300 border-mint-300 pointer-events-none",
        },
    };

    const sizeVariants = {
        md: { text: "text-md p-1", icon: "1.5rem" },
        lg: { text: "text-lg p-1", icon: "1.75rem" },
        xl: { text: "text-xl p-2", icon: "1.75rem" },
    };

    return (
        <button
            className={`${
                isLoading || isDisabled
                    ? colorVariants[color].disabled
                    : colorVariants[color].active
            } ${colorVariants[color].style} ${sizeVariants[size].text} ${
                !isIcon ? "flex-1" : "px-2"
            } flex items-center justify-center rounded-lg border-2 font-bold uppercase shadow-sm shadow-slate-400 transition-all`}
            onClick={onClick}
            disabled={isLoading || isDisabled}>
            {isLoading && !isIcon ? (
                <AiOutlineLoading
                    className="animate-spin"
                    size={sizeVariants[size].icon}
                />
            ) : (
                children
            )}
        </button>
    );
}
