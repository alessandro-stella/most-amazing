import type { Category, Image, Product } from "@prisma/client";
import { Context } from "context/Context";
import { useContext } from "react";
import ProductCard from "../product/ProductCard";
import HomeBanner from "./HomeBanner";

export default function HomePage({
    products,
}: {
    products: (Product & {
        categories: Category[];
        images: Image[];
    })[];
}) {
    const { selectedCategory } = useContext(Context);

    return (
        <div className="flex-[6] bg-slate-50 p-6">
            <HomeBanner />

            <div className="flex gap-2 divide-x-2 divide-black">
                {products.length !== 0
                    ? products.map((product, index) =>
                          ProductCard(product, index)
                      )
                    : "no products"}
            </div>
        </div>
    );
}
