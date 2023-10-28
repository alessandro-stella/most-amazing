import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function searchProducts(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { keywords, category } = JSON.parse(req.body as string) as {
        keywords: string | undefined;
        category: number;
    };

    const query = {
        ...{
            name: keywords
                ? {
                      contains: keywords,
                  }
                : {},
        },
        ...{
            categories:
                category !== 0
                    ? {
                          some: { id: category },
                      }
                    : {},
        },
    };

    const finalQuery = {
        where: Object.entries(query).length !== 0 ? query : undefined,
        include: { categories: true, images: true },
    };

    const products = await prisma.product.findMany(finalQuery);

    return res.status(200).json(products);
}
