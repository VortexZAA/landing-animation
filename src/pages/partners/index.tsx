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
    }, 700);
    //reload
  }, []);
  return (
    <>
      {show && <Header />}
      <div className="text-2xl  md:text-5xl w-full md:w-2/3 xl:w-1/2  h-fit text-center z-20  fixed top-1/2 left-1/2  flex flex-col transform -translate-x-1/2 -translate-y-1/2 gap-10 text-white launch animate-fadeIn3">
        <h2 className="text-4xl">Partners</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 xl:gap-6 px-3">
          {partners.map((partner) => (
            <div className="flex justify-center items-center backdrop-blur-md bg-white/20 rounded-lg p-3">
              <a href={partner.link} target="_blank" rel="noreferrer">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-[180px] h-fit "
                />
              </a>
            </div>
          ))}
        </div>
      </div>
      {show && <Footer status={true} />}
    </>
  );
}

const partners = [
  {
    //binance
    id: 1,
    name: "Binance",
    logo: "/images/partners/bnb.png",
    link: "https://binance.com",
  },
  {
    //Bevm
    id: 2,
    name: "Bevm",
    logo: "/images/partners/bevm.svg",
    link: "https://bevm.io",
  },
  {
    //delta labs
    id: 3,
    name: "Delta Labs",
    logo: "/images/partners/delta.png",
    link: "https://deltalabs.pro",
  },
  {
    //Ave
    id: 4,
    name: "Ave",
    logo: "/images/partners/ave.png",
    link: "https://twitter.com/aveaiofficial",
  },
  {
    //blockbridge digital
    id: 5,
    name: "Blockbridge Digital",
    logo: "/images/partners/blockbridge.png",
    link: "https://blockbridge.xyz/",
  },
  {
    //bitget wallet
    id: 6,
    name: "Bitget Wallet",
    logo: "/images/partners/bitget.png",
    link: "https://bitget.com",
  },
  //pyth
  {
    id: 7,
    name: "Pyth",
    logo: "/images/partners/pyth.svg",
    link: "https://pyth.network",
  },
  //subquery
  {
    id: 8,
    name: "SubQuery",
    logo: "/images/partners/subquery.svg",
    link: "https://subquery.network",
  },
  //aeroscrapper
  {
    id: 9,
    name: "Aeroscrapper",
    logo: "/images/partners/aeroscrapper.svg",
    link: "https://twitter.com/aeroscraper",
  },
  //nova-ratio
  {
    id: 10,
    name: "Nova Ratio",
    logo: "/images/partners/nova-ratio.svg",
    link: "https://novaratio.io/",
  },
];
