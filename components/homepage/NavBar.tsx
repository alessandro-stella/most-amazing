import { type Category } from "@prisma/client";
import Select from "components/Select";
import { Context } from "context/Context";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function NavBar({ categories }: { categories: Category[] }) {
    const { setSelectedCategory } = useContext(Context);
    const [searchCategory, setSearchCategory] = useState("");

    function goToHome() {
        setSelectedCategory("");
    }

    useEffect(() => {
        console.log({ searchCategory });
    }, [searchCategory]);

    return (
        <div className="flex h-[4.5rem] w-screen gap-5 border-b-[1px] border-slate-600 bg-slate-700 p-4">
            {/* <div className="h-full"> */}
            {/* <div
                    className="relative ml-2 aspect-[4.42/1] h-full"
                    onClick={() => void goToHome()}>
                    <Image
                        priority={true}
                        src="/fullLogo-white.svg"
                        alt="AMAZING"
                        fill
                        className="cursor-pointer"
                    />
                </div> */}
            <div
                className="relative ml-2 aspect-square h-full"
                onClick={() => void goToHome()}>
                <Image
                    priority={true}
                    src="/smallLogo-white.svg"
                    alt="AMAZING"
                    fill
                    className="cursor-pointer"
                />
            </div>
            {/* </div> */}

            <div className="flex flex-[6] items-center justify-between">
                <div className="flex h-full flex-1 divide-x-[1px] divide-slate-400 rounded-md border-[1px] border-slate-400 bg-slate-600">
                    <input
                        type="text"
                        className="flex-1 bg-transparent px-2 text-white outline-none"
                        placeholder="Search..."
                    />

                    <Select
                        select={setSearchCategory}
                        options={[
                            "all categories",
                            ...categories.map((category) => category.name),
                        ]}
                    />

                    <div className="grid aspect-square h-full place-content-center rounded-r-md bg-mint-500 text-white">
                        <FiSearch />
                    </div>
                </div>

                <div className="flex flex-1 justify-end gap-4 text-white">
                    <div>favourite</div>
                    <div>cart</div>
                    <div>notifications (maybe)</div>
                    <div>profile</div>
                </div>
            </div>
        </div>
    );
}
