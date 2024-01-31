import Image from "next/image";
import { useEffect, useState } from "react";
import SideBar from "../components/sidebar";
import { Alert } from "../components/alert/alert";
import Loader from "@/components/Loader";
import { useAppSelector } from "@/hook/redux/hooks";
import { selectData } from "@/redux/auth/auth";
import MatrixBackground from "@/components/matrix";
import FluidAnimation from "@/components/FluidAnimation";
import Head from "next/head";
import Footer from "@/components/footer";

export default function Layout({
  title = "",
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const reduxData = useAppSelector(selectData);
  const { loading } = reduxData;
  useEffect(() => {
    document.title = "SoulBound Protocol | "+title;
  }, [title]);
  return (
    <>
      {/* <div className="absolute z-10 w-full h-screen left-0 top-0 opacity-30 overflow-hidden">
        <div className="wrap flex justify-between w-[70vw]">
          <div className="c"></div>
          {new Array(140).fill(0).map((_, i) => (
            <div key={i} className="c"></div>
          ))}
        </div> */}

      <main
        className={`flex min-h-[100dvh] w-screen max-w-[100vw] overflow-x-hidden gap-6  items-center justify-between z-20 relative wrap`}
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
        <Footer />
      </main>
    </>
  );
}
