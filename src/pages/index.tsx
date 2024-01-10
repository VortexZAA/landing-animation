import Footer from "@/components/footer";
import Header from "@/components/header";
import PartnersSlider from "@/components/slider";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Intro() {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 2000);
    //reload
  }, []);
  return (
    <>
      {show && <Header />}
      <div className="text-2xl md:block -mt-16 md:text-5xl w-full md:w-2/3 xl:w-1/2  h-fit text-center z-20  fixed top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 text-white launch animate-fadeIn3">
        <h1 id="h1" className={` shrink-0 w-full`}>
          SoulBound Protocol
        </h1>
      </div>
      {show && (
        <div className="z-20 absolute bottom-0 flex flex-col pb-20 md:pb-16 left-0 max-w-[100vw] animate-fadeIn">
          <PartnersSlider />
          <Footer status={true} />
        </div>
      )}
    </>
  );
}
