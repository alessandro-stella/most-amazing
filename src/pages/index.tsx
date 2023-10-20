import type { Category, Product } from "@prisma/client";
import CategoryList from "components/CategoryList";
import ProductList from "components/HomePage";
import NavBar from "components/NavBar";
import type { GetServerSideProps } from "next";
import Head from "next/head";
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
    products,
    categories,
}: {
    products: (Product & {
        categories: Category[];
    })[];
    categories: Category[];
}) {
    return (
        <>
            <Head>
                <title>Amazing</title>
            </Head>

            <div className="flex min-h-screen flex-col bg-green-200">
                <NavBar />

                <div className="flex flex-1 bg-green-500">
                    {/* <Link href="/auth/login">LOGIN</Link> */}

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
    const products: Product[] = await prisma.product.findMany({
        include: { categories: true },
    });

    const categories: Category[] = await prisma.category.findMany({});

    return {
        props: {
            products: products ?? [],
            categories,
        },
    };
};
