import type { Category, Product } from "@prisma/client";
import CategoryList from "components/CategoryList";
import ProductList from "components/ProductList";
import type { GetServerSideProps } from "next";
import { signOut } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
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

            <div className="min-h-screen gap-2 bg-green-200">
                <div className="h-16 w-screen bg-slate-800 p-2">
                    <div className="relative aspect-[4.42/1] h-full">
                        <Image
                            priority={true}
                            src="/fullLogo-white.svg"
                            alt="AMAZING"
                            fill
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link href="/auth/login">LOGIN</Link>
                    <button onClick={() => void signOut()}>SIGN OUT</button>

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
