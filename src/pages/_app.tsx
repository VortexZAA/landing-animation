import "@/styles/globals.css";
import "reactflow/dist/style.css";
import type { AppProps } from "next/app";
import { store } from "@/redux/store";
import { Provider, useDispatch } from "react-redux";
import Script from "next/script";
import { useEffect } from "react";
import { setClear } from "@/redux/auth/auth";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/hook/redux/hooks";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <Script src="/script.js"></Script>
    </Provider>
  );
}
