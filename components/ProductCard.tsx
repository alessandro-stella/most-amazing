import type { Category, Product } from "@prisma/client";

export default function ProductCard(
    product: Product & {
        categories: Category[];
    },
    index: number
) {
    console.log({ product });

    return <div key={index}>product</div>;
}
