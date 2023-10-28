import type { Category, Image as ImageType, Product } from "@prisma/client";

export default function ProductCard(
    product: Product & {
        categories: Category[];
        images: ImageType[];
    },
    index: number
) {
    console.log({ product });

    return (
        <div key={index}>
            <div>id:{product.id}</div>
            <div>name:{product.name}</div>
            <div>description:{product.description}</div>
            <div>price:{product.price}</div>
            <div>shippingPrice:{product.shippingPrice}</div>
            <div>inStock:{product.inStock}</div>
            <div>hasBeenDeleted:{product.hasBeenDeleted}</div>
            <div>sellerId:{product.sellerId}</div>
        </div>
    );
}
