import { type Config } from "tailwindcss";

export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                white: "#FEFEFE",
                mint: {
                    50: "#EBF9F8",
                    100: "#D7F4F1",
                    200: "#AFE9E3",
                    300: "#83DDD4",
                    400: "#5CD2C6",
                    500: "#37C8B9",
                    600: "#2DA498",
                    700: "#238077",
                    800: "#195C55",
                    900: "#0F3834",
                    950: "#0B2825",
                },
                slate: {
                    50: "#ECEFF4",
                    100: "#D5DDE6",
                    200: "#AFBECF",
                    300: "#859CB7",
                    400: "#5D7B9D",
                    500: "#465D76",
                    600: "#2E3C4D",
                    700: "#161D25",
                    800: "#0F141A",
                    900: "#080A0D",
                    950: "#040506",
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
