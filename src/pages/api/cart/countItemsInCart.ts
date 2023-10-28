import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function countProductsInCart(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = JSON.parse(req.body as string) as { userId: string };

    const cart:
        | {
              id: number;
              ownerId: string;
          }
        | null
        | undefined = (
        await prisma.user.findUnique({
            where: { id: userId },
            select: { cart: true },
        })
    )?.cart;

    let itemCounter = 0;

    if (!cart) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                cart: {
                    create: {},
                },
            },
        });
    } else {
        const items = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: {
                _count: {
                    select: { orders: true },
                },
            },
        });

        itemCounter = items?._count.orders ?? 0;
    }

    return res.status(200).json({ itemCounter });
}
