import { FaXmark } from "react-icons/fa6";

interface InputParameters {
    type: string;
    value: string;
    label: string;
    setValue: (value: string) => void;
    isDisabled: boolean;
    isShown?: boolean;
    setIsShown?: (value: (currentValue: boolean) => boolean) => void;
    error?: string[];
}

export default function CustomTextInput({
    type,
    value,
    label,
    setValue,
    isDisabled,
    isShown,
    setIsShown = undefined,
    error,
}: InputParameters) {
    return (
        <div className="relative">
            <div className="flex gap-3 items-end">
                <div className="text-xl font-bold">{label}</div>

                {setIsShown && (
                    <div
                        className="underline text-sm cursor-pointer text-mint-800 hover:text-mint-700 w-fit select-none mb-[0.125rem]"
                        onClick={() => setIsShown((isShown) => !isShown)}>
                        {isShown === true ? "Hide" : "Show"} password
                    </div>
                )}
            </div>

            <div className="relative">
                <input
                    className={`w-full py-2 px-[0.125rem] transition-all outline-none bg-transparent border-b-2 pr-8 placeholder-mint-600 ${
                        error && error.length !== 0
                            ? "border-red-500"
                            : "border-mint-600"
                    } ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
                    type={type}
                    value={value}
                    placeholder={label}
                    onChange={(e) => setValue(e.target.value)}
                />

                <div
                    className={`absolute right-0 top-0 h-full grid place-content-center px-2 pointer-events-none ${
                        error && error?.length !== 0
                            ? "text-red-500"
                            : "text-mint-700"
                    }`}>
                    {error?.length !== 0 && <FaXmark />}
                </div>
            </div>

            {error?.length !== 0 && (
                <div className="text-xs mt-2 text-red-500">
                    {error?.map((e, index) => (
                        <div key={index}>{e}</div>
                    ))}
                </div>
            )}
        </div>
    );
}
