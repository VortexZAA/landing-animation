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
            <ul className="flex items-center">
              <li className="inline-block mx-1">
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
