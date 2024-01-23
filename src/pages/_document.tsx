import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="SoulBound Protocol" />
        <link rel="icon" href="/favicon.png" />
        <meta name="keywords" content="SoulBound Protocol" />
        <script src="/script.js"></script>
      </Head>
      <title>SoulBound Protocol</title>
      <body className="max-w-[100vw] overflow-x-hidden bg-black min-h-[100dvh]">
        <canvas id="canvas" className="fixed z-10 bg-white"></canvas>
        
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
