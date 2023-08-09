import ProductCard from "./ProductCard";
import type { Category, Product } from "@prisma/client";
import { Context } from "context/Context";
import { useContext } from "react";

export default function ProductList({
    products,
}: {
    products: (Product & {
        categories: Category[];
    })[];
}) {
    const { selectedCategory } = useContext(Context);

    return (
        <div>
            <div>
                Product:
                {selectedCategory === ""
                    ? "NO CATEGORY SELECTED"
                    : selectedCategory}
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
