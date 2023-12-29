import Footer from "@/components/footer";
import Header from "@/components/header";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

const FluidAnimation = dynamic(() => import("@/components/FluidAnimation"), {
  ssr: false,
});
export default function Intro() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 2000);
    //reload
  }, []);
  return (
    <>
      {show && <Header />}
      <div className="text-2xl md:block md:text-5xl w-full  h-fit text-center z-20  fixed top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 text-white launch animate-fadeIn3">
        <h1 id="h1" className={``}>
          SoulBound Protocol
        </h1>
      </div>
      <Footer status={true}/>
    </>
  );
}
