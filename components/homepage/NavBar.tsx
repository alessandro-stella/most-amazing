import { type Category } from "@prisma/client";
import Select from "components/Select";
import CartIcon from "components/homepage/CartIcon";
import { Context } from "context/Context";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { FiBell, FiHeart, FiSearch, FiUser } from "react-icons/fi";

export default function NavBar({ categories }: { categories: Category[] }) {
    const { setSelectedCategory } = useContext(Context);
    const [searchCategory, setSearchCategory] = useState("");

    function goToHome() {
        setSelectedCategory("");
    }

    return (
        <div className="flex h-[4.5rem] w-screen justify-between gap-16 border-b-[1px] border-slate-600 bg-slate-700 px-6 py-4">
            <div
                className="relative hidden aspect-[4.42/1] h-full lg:block"
                onClick={() => void goToHome()}>
                <Image
                    priority={true}
                    src="/fullLogo-white.svg"
                    alt="AMAZING"
                    fill
                    className="cursor-pointer"
                />
            </div>

            <div
                className="relative aspect-square h-full lg:hidden"
                onClick={() => void goToHome()}>
                <Image
                    priority={true}
                    src="/smallLogo-white.svg"
                    alt="AMAZING"
                    fill
                    className="cursor-pointer"
                />
            </div>

            <div className="flex h-full flex-1 divide-x-[1px] divide-slate-400 rounded-md bg-slate-600">
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
                    <FiSearch size={20} />
                </div>
            </div>

            <div className="flex justify-end gap-6 text-white">
                <FiHeart
                    size={30}
                    className="aspect-square h-full cursor-pointer fill-transparent transition-all hover:fill-mint-400 hover:text-mint-400"
                />

                <CartIcon />

                <FiBell
                    size={30}
                    className="aspect-square h-full cursor-pointer fill-transparent transition-all hover:fill-mint-400 hover:text-mint-400"
                />

                <div className="grid aspect-square cursor-pointer place-content-center rounded-full border-2 border-mint-400 text-mint-400 transition-all hover:bg-mint-400 hover:fill-white hover:text-white">
                    <FiUser size={24} className="aspect-square h-full" />
                </div>
            </div>
        </div>
    );
}
