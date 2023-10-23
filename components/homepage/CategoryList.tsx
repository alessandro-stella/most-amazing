import type { Category } from "@prisma/client";
import { Context } from "context/Context";
import { signIn, signOut } from "next-auth/react";
import { useContext } from "react";

export default function CategoryList({
    categories,
}: {
    categories: Category[];
}) {
    const { selectedCategory, setSelectedCategory } = useContext(Context);

    return (
        <div className="flex-1 bg-slate-700 p-4 pl-0 text-2xl">
            <div className="flex flex-col gap-2">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className={`relative ml-4 cursor-pointer select-none rounded-md p-2 text-lg capitalize transition-all hover:bg-slate-600 ${
                            selectedCategory === category.name
                                ? "bg-slate-600 font-bold text-mint-400"
                                : "text-white"
                        }`}
                        onClick={() => setSelectedCategory(category.name)}>
                        {category.name}

                        <div
                            className={`pointer-events-none absolute left-0 top-0 h-1/2 w-[0.25em] -translate-x-4 translate-y-1/2 rounded-r-md transition-all ${
                                selectedCategory === category.name
                                    ? "bg-mint-400"
                                    : "bg-transparent"
                            }`}></div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col">
                <button onClick={() => void signIn()}>SIGN IN</button>
                <button onClick={() => void signOut()}>SIGN OUT</button>
            </div>
        </div>
    );
}
