import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { MdExpandMore } from "react-icons/md";

export default function Select({
    select,
    options,
}: {
    select: Dispatch<SetStateAction<string>>;
    options: string[];
}) {
    const [selectedOption, setSelectedOption] = useState(options[0] ?? "");
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        select(selectedOption);
    }, [selectedOption, select]);

    function handleChange(option: string) {
        setSelectedOption(option);
        setShowOptions(false);
    }

    return (
        <div
            className={`z-10 h-full cursor-pointer text-white ${
                showOptions ? "bg-slate-400" : "bg-slate-600"
            }`}>
            <div
                className="flex h-full select-none items-center justify-between gap-4 px-2"
                onClick={() => setShowOptions(!showOptions)}>
                <div className="w-max capitalize">{selectedOption}</div>

                <MdExpandMore
                    className={`transition-all ${
                        showOptions ? "-rotate-180" : "rotate-0"
                    }`}
                />
            </div>

            <div
                className={`flex origin-top flex-col divide-y divide-slate-400 rounded-b-md bg-slate-600 transition-all ${
                    showOptions ? "scale-y-100" : "scale-y-0"
                }`}>
                {options.map((option, index) => (
                    <div
                        className={`whitespace-nowrap px-2 py-1 capitalize hover:bg-slate-400 ${
                            index === 0 ? "border-t-[1px] border-slate-400" : ""
                        }`}
                        key={index}
                        onClick={() => handleChange(option)}>
                        {option}
                    </div>
                ))}
            </div>
        </div>
    );
}
