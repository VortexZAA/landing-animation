import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="FACI Protocol" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="keywords" content="FACI Protocol" />
      </Head>
      <title>FACI Protocol</title>
      <body className="max-w-[100vw] overflow-x-hidden bg-black ">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
