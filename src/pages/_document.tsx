import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="SoulBound Protocol" />
        <link rel="icon" href="/favicon.png" />
        <meta name="keywords" content="SoulBound Protocol" />
      </Head>
      <title>SoulBound Protocol</title>
      <body className="max-w-[100vw] overflow-x-hidden bg-black ">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
