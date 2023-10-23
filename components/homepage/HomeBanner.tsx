import Image from "next/image";

export default function HomeBanner() {
    return (
        <div className="z-[5] flex w-full gap-10 rounded-xl bg-gradient-to-tr from-mint-500 to-mint-300 shadow-md">
            <div className="flex flex-col gap-8 p-8">
                <div className="text-6xl font-bold text-white">
                    Free Delivery!
                </div>
                <div className="text-2xl text-white">
                    <div>
                        Don&apos;t miss it out! Only today, get free Next Day
                    </div>
                    <div>delivery on all your orders!</div>
                </div>
                <div className="w-fit cursor-pointer rounded-full bg-white px-8 py-4 text-2xl font-bold text-mint-400 shadow-md">
                    Browse products
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center overflow-hidden">
                <div className="relative  aspect-square h-full scale-[4]">
                    <Image
                        priority={true}
                        src="/arrows.svg"
                        alt="arrows"
                        fill
                    />
                </div>
            </div>
        </div>
    );
}
