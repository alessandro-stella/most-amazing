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
                    50: "#ECEDF3",
                    100: "#DADAE7",
                    200: "#B5B6CF",
                    300: "#8D8EB5",
                    400: "#68699D",
                    500: "#4E5079",
                    600: "#363753",
                    700: "#2A2B41",
                    800: "#202131",
                    900: "#14141F",
                    950: "#101019",
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
