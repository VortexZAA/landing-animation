import Image from "next/image";
import { useState } from "react";
import SideBar from "../components/sidebar";
import { Alert } from "../components/alert/alert";
import Loader from "@/components/Loader";
import { useAppSelector } from "@/hook/redux/hooks";
import { selectData } from "@/redux/auth/auth";
import MatrixBackground from "@/components/matrix";
import FluidAnimation from "@/components/FluidAnimation";
import Head from "next/head";

export default function Layout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const reduxData = useAppSelector(selectData);
  const { loading } = reduxData;
  return (
    <>
      <Head>
        <title>SoulBound Protocol | {title}</title>
      </Head>
      <main
        className={`flex min-h-screen w-screen max-w-[100vw] overflow-x-hidden gap-6  items-center justify-between z-20 relative`}
      >
        <MatrixBackground />
        <SideBar />
        <div className="w-full pl-[86px] xl:pl-[280px] h-full pb-6 flex flex-col gap-3 min-h-[100vh] max-w-[100vw]  text-white p-3 xl:p-6 relative animate-fadeIn">
          {loading && <Loader />}
          <h2 className="text-2xl xl:text-4xl font-bold mb-3 drop-shadow-md ">
            {title}
          </h2>
          {children}
        </div>
        <footer className="w-full h-16  absolute bottom-3 left-0  flex items-center justify-between  pr-6 text-white text-sm font-normal">
          <div className="ml-[86px] xl:ml-[280px] px-6 backdrop-blur-sm flex items-center justify-between bg-white/10 rounded-md h-full w-full">
            <p className="text-center">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
            <ul className="flex items-center gap-3">
              <li className="inline-block mx-1">
                <a
                  href="https://twitter.com/SoulBound_BTC"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-orange-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="h-8 w-fit"
                    viewBox="0 0 512 512"
                  >
                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/QJKbNrTp"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-orange-400 transition-colors"
                >
                  <svg
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-fit"
                    viewBox="0 0 640 512"
                  >
                    <path d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/soulboundprotocol"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-orange-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-fit"
                    fill="currentColor"
                    viewBox="0 0 496 512"
                  >
                    <path d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </main>
    </>
  );
}
