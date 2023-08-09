import type { Category } from "@prisma/client";
import { Context } from "context/Context";
import { useContext } from "react";

export default function CategoryList({
    categories,
}: {
    categories: Category[];
}) {
    const { selectedCategory, setSelectedCategory } = useContext(Context);

    return (
        <div className="bg-red-600 text-2xl">
            {categories.map((category) => (
                <div
                    key={category.id}
                    className={`${
                        selectedCategory === category.name
                            ? "bg-red-400"
                            : "bg-cyan-200"
                    }`}
                    onClick={() => setSelectedCategory(category.name)}>
                    {category.name}
                </div>
            ))}
        </div>
    );
}
