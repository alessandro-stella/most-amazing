import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta
                    name="description"
                    content='A new take on the "popular" Amazing online store'
                />

                <link
                    href="/smallLogo-black.svg"
                    rel="icon"
                    media="(prefers-color-scheme: light)"
                />

                <link
                    href="/smallLogo-white.svg"
                    rel="icon"
                    media="(prefers-color-scheme: dark)"
                />
            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
