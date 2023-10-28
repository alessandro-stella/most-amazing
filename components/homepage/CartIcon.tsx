import { Context } from "context/Context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";

export default function CartIcon() {
    const router = useRouter();
    const { data: session } = useSession();
    const { productsInCart, setProductsInCart } = useContext(Context);

    useEffect(() => {
        if (session === undefined || session === null) return;

        void (async () => {
            const items = (await fetch("/api/cart/countProductsInCart", {
                method: "POST",
                body: JSON.stringify({ userId: session.user.id }),
            }).then((res) => res.json())) as { itemCounter: number };

            setProductsInCart(items.itemCounter);
        })();
    }, [session, setProductsInCart]);

    async function openCart() {
        await router.push("/cart");
    }

    return (
        <div
            className={`relative grid aspect-square place-content-center rounded-md ${
                productsInCart === 0
                    ? ""
                    : "cursor-pointer border-2 border-mint-400 bg-mint-400"
            }`}
            onClick={() => void openCart()}>
            <FiShoppingCart
                size={productsInCart !== 0 ? 24 : 30}
                className={`aspect-square h-full fill-transparent ${
                    productsInCart === 0
                        ? "cursor-pointer transition-all hover:fill-mint-400 hover:text-mint-400"
                        : ""
                }`}
            />

            {productsInCart !== 0 && (
                <div className="absolute -right-1/3 -top-1/3 rounded-full bg-white p-1 text-center text-xs text-black">
                    {productsInCart}
                </div>
            )}
        </div>
    );
}
