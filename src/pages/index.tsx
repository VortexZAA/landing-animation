import Modal from "@/components/Modal";
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
      <div className="text-2xl md:block md:text-5xl w-full  h-fit text-center z-20  fixed top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 text-white launch animate-fadeIn3">
        <h1 id="h1" className={``}>
          SoulBound Protocol
        </h1>
        {show && (
          <Link href={"/whitelist"}>
            <button className="border-4 border-white hover:text-black animate-fadeIn rounded-md py-3 px-6 mt-36 text-xl hover:bg-white transition-all">
              Join Badge Whitelist
            </button>
          </Link>
        )}
      </div>
      {show && <Footer status={true} />}
      {/*  <Modal modal={showModal} setModal={setShowModal} title="Join Badge Whitelist">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Enter your email"
            className="outline-none border-2 rounded-lg border-gray-200 p-3 text-black"
          />
          <button className="bg-purple hover:opacity-95 text-white rounded-lg py-3 disabled:opacity-70 disabled:cursor-not-allowed w-full gap-3 flex justify-center items-center">
            Join
          </button>
        </div>
      </Modal> */}
    </>
  );
}
