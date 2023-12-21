import FluidAnimation from "@/components/FluidAnimation";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function Intro() {
    const [show , setShow] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, 3000);
    }, [])
  return (
    <main
      className={`flex min-h-screen h-screen w-screen max-w-[100vw] relative overflow-x-hidden gap-6  items-center justify-center animate-fadeIn text-white launch `} 
    >
      <h1  id="h1" className={`text-2xl hidden md:block md:text-5xl w-full text-center `} > SoulBound Protocol</h1>
      {/* <h1 className={`text-2xl md:text-5xl w-full text-center !visible block md:hidden `} >SoulBound Protocol</h1> */}
      {show && <Link href="/nft-buy" className="absolute mt-32 border-2 border-white rounded-full px-6 py-2 hover:bg-white hover:text-black transition-colors animate-fadeIn ">Launch App</Link>}
      <FluidAnimation />
    </main>
  );
}
