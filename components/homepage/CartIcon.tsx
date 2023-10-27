import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";

export default function CartIcon() {
    const { data: session, status } = useSession();
    const [items, setCartItems] = useState(0);

    useEffect(() => {
        if (session === undefined || session === null) return;

        void (async () => {
            const items = (await fetch("/api/cart/countItemsInCart", {
                method: "POST",
                body: JSON.stringify({ userId: session.user.id }),
            }).then((res) => res.json())) as { itemCounter: number };

            setCartItems(items.itemCounter);
        })();
    }, [session]);

    return (
        <div
            className={`relative grid aspect-square place-content-center rounded-md ${
                items === 0
                    ? ""
                    : "cursor-pointer border-2 border-mint-400 bg-mint-400"
            }`}>
            <FiShoppingCart
                size={items !== 0 ? 24 : 30}
                className={`aspect-square h-full fill-transparent ${
                    items === 0
                        ? "cursor-pointer transition-all hover:fill-mint-400 hover:text-mint-400"
                        : ""
                }`}
            />

            {items !== 0 && (
                <div className="absolute -right-1/3 -top-1/3 rounded-full bg-white p-1 text-center text-xs text-black">
                    {items}
                </div>
            )}
        </div>
    );
}
