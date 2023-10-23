import type { Category, Product } from "@prisma/client";
import { Context } from "context/Context";
import { useContext } from "react";
import HomeBanner from "./HomeBanner";
import ProductCard from "../product/ProductCard";

export default function HomePage({
    products,
}: {
    products: (Product & {
        categories: Category[];
    })[];
}) {
    const { selectedCategory } = useContext(Context);

    return (
        <div className="flex-[6] bg-slate-50 p-6">
            <div className="bg-white">
                {selectedCategory === "" ? <HomeBanner /> : selectedCategory}
            </div>

            <div>
                {products.length !== 0
                    ? products.map((product, index) =>
                          ProductCard(product, index)
                      )
                    : "no products"}
            </div>
        </div>
    );
}
