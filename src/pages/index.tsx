import type { Category, Image, Product } from "@prisma/client";
import CategoryList from "components/homepage/CategoryList";
import ProductList from "components/homepage/HomePage";
import NavBar from "components/homepage/NavBar";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { prisma } from "~/server/db";

/* 
const categories = [
    "echo and alexa",
    "kindle",
    "books",
    "electronics",
    "home and garden",
    "fashion",
    "health and beauty",
    "automotive",
    "sport and tourism",
    "games",
    "film and music",
    "animals",
    "hobby",
    "gift cards"
];
*/

export default function Home({
    propsProducts,
    categories,
}: {
    propsProducts: (Product & {
        categories: Category[];
        images: Image[];
    })[];
    categories: Category[];
}) {
    const [products, setProducts] = useState(propsProducts);

    useEffect(() => {
        console.log("IN INDEX");
        console.log(products);
    }, [products]);

    return (
        <>
            <Head>
                <title>Amazing</title>
            </Head>

            <div className="flex min-h-screen flex-col">
                <NavBar
                    categories={categories?.length > 0 ? categories : []}
                    updateProducts={setProducts}
                />

                <div className="flex w-screen flex-1 ">
                    <CategoryList
                        categories={categories?.length > 0 ? categories : []}
                    />

                    <ProductList
                        products={products?.length > 0 ? products : []}
                    />
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    const products: (Product & { categories: Category[]; images: Image[] })[] =
        await prisma.product.findMany({
            include: { categories: true, images: true },
        });

    const categories: Category[] = await prisma.category.findMany({});

    return {
        props: {
            propsProducts: products,
            categories,
        },
    };
};
