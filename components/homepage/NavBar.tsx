import type { Category, Image as ImageType, Product } from "@prisma/client";
import Select from "components/Select";
import CartIcon from "components/homepage/CartIcon";
import { Context } from "context/Context";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import type { Dispatch, SetStateAction } from "react";
import { useContext, useState } from "react";
import { FiBell, FiHeart, FiSearch, FiUser } from "react-icons/fi";

export default function NavBar({
    categories,
    updateProducts,
}: {
    categories: Category[];
    updateProducts: Dispatch<
        SetStateAction<
            ({
                id: string;
                name: string;
                description: string;
                price: number;
                shippingPrice: number | null;
                inStock: number;
                hasBeenDeleted: boolean;
                sellerId: string;
            } & {
                categories: Category[];
                images: ImageType[];
            })[]
        >
    >;
}) {
    const router = useRouter();
    const { setSelectedCategory } = useContext(Context);
    const { data: session } = useSession();
    const [keywords, setKeywords] = useState("");
    const [searchCategory, setSearchCategory] = useState(0);

    function goToHome() {
        setSelectedCategory("");
    }

    async function handleUser() {
        if (session) {
            await router.push("/auth/profile");
            return;
        }

        await router.push("/auth/login");
    }

    async function searchProducts() {
        const products = (await fetch("/api/products/searchProducts", {
            method: "POST",
            body: JSON.stringify({ keywords, category: searchCategory }),
        }).then((res) => res.json())) as (Product & {
            categories: Category[];
            images: ImageType[];
        })[];

        console.log("IN NAVBAR");
        console.log(products);

        updateProducts(products);
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
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                />

                <Select
                    select={setSearchCategory}
                    options={[
                        "all categories",
                        ...categories.map((category) => category.name),
                    ]}
                />

                <div
                    className="grid aspect-square h-full cursor-pointer place-content-center rounded-r-md bg-mint-500 text-white transition-all hover:brightness-125"
                    onClick={() => void searchProducts()}>
                    <FiSearch size={20} />
                </div>
            </div>

            <div className="flex justify-end gap-6 text-white">
                <FiHeart
                    size={30}
                    className="aspect-square h-full cursor-pointer fill-transparent transition-all hover:fill-mint-400 hover:text-mint-400 hover:brightness-125"
                />

                <CartIcon />

                <FiBell
                    size={30}
                    className="aspect-square h-full cursor-pointer fill-transparent transition-all hover:fill-mint-400 hover:text-mint-400 hover:brightness-125"
                />

                <div className="grid aspect-square cursor-pointer place-content-center rounded-full border-2 border-mint-400 text-mint-400 transition-all hover:bg-mint-400 hover:fill-white hover:text-white hover:brightness-125">
                    <FiUser
                        size={24}
                        className="aspect-square h-full"
                        onClick={() => void handleUser()}
                    />
                </div>
            </div>
        </div>
    );
}
