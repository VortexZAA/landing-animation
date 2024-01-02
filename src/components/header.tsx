import Link from "next/link";
import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const { pathname } = router;
  const [showMobile, setShowMobile] = useState(false);
  const [path, setPath] = useState(pathname);
  const duration: number = 600;
  //scroll 50px down add header bg
  const [scroll, setScroll] = useState(false);
  const handleScroll = () => {
    if (window.scrollY >= 30) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll);
  }

  return (
    <>
      <header
        className={`w-full backdrop-blur-sm text-white bg-white/5 fixed left-0 top-0 flex items-center h-16 md:h-20 py-2 lg:py-3 gap-6 justify-center  z-50 transition-colors animate-fadeIn   ${
          scroll && !showMobile
            ? "  animate__animated animate__fadeInDown animate__faster lg:shadow-sm"
            : ""
        }`}
      >
        <div className="flex justify-between px-3 lg:px-6 2xl:px-12 w-full h-full container items-center">
          <Link
            href={"/"}
            className=" shrink-0 w-fit font-brando h-full z-50 flex gap-3 font-semibold items-center text-sm md:text-base 2xl:text-2xl"
          >
            <Image
              src={"/logo.png"}
              width={200}
              height={200}
              className="h-full w-fit"
              alt=""
            />
          </Link>
          <ul className="flex-col w-full   hidden lg:flex lg:relative pt-12 lg:pt-0 bottom-0 left-0 items-center justify-center h-full  lg:h-auto lg:flex-row lg:mt-0 text-sm xl:text-sm font-normal  gap-6 2xl:gap-12 transition-all">
            {menu.map((item, index) => {
              return (
                <li
                  key={index}
                  className="flex flex-col justify-center group items-center  shrink-0 w-fit "
                >
                  <Link
                    href={item.link}
                    target={item.target}
                    className={`flex justify-center items-center py-3 lg:hover:text-orange-400 transition-colors cursor-pointer text-center w-full font-bold ${item?.addClass} `}
                  >
                    {item.title}
                  </Link>
                  {item.comingSoon && (
                    <span className="text-xs group-hover:flex absolute -bottom-2 hidden text-orange-400 font-bold">
                      Coming soon
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {showMobile ? (
            <button
              className="block lg:hidden shrink-0"
              onClick={() => setShowMobile(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setShowMobile(true)}
              className="block lg:hidden space-y-[6px] shrink-0"
            >
              <span className="block w-6 h-[3px] md:h-1 bg-gray-100"></span>
              <span className="block w-6 h-[3px] md:h-1 bg-gray-100"></span>
              <span className="block w-6 h-[3px] md:h-1 bg-gray-100"></span>
            </button>
          )}
        </div>
      </header>
      <ul
        className="flex lg:hidden z-40 flex-col fixed  bg-black lg:bg-transparent lg:relative  top-0 left-0 items-center justify-center lg:justify-end  lg:h-auto lg:flex-row lg:mt-0 text-xl font-normal w-full lg:w-1/2 gap-6 text-white transition-all h-screen overflow-y-auto"
        style={{
          transform: showMobile ? "translateX(0)" : "translateX(100%)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {menu.map((item, index) => {
          return (
            <li
              key={index}
              className="flex justify-center group items-center text-white relative shrink-0 w-fit "
            >
              <Link
                href={item.link}
                target={item.target}
                onClick={() => setShowMobile(!showMobile)}
                className={` justify-center items-center py-0 !text-white lg:border-0 lg:hover:text-orange-400 transition-colors cursor-pointer text-center w-full ${item?.addClass} `}
              >
                {item.title}
              </Link>
              {item.comingSoon && (
                <span className="text-xs group-hover:flex absolute -bottom-3 md:-bottom-2  md:hidden text-orange-400 font-bold">
                  Coming soon
                </span>
              )}
            </li>
          );
        })}
        <li className="flex flex-col md:hidden group text-white justify-center items-center py-0 -mt-2  lg:border-0 lg:hover:text-orange-400 transition-colors cursor-pointer text-center w-full relative">
          <button className=" justify-center items-center peer  lg:border-0 lg:hover:text-orange-400  cursor-pointer text-center w-fullborder-2 border-white rounded-full px-6 py-2 bg-white text-black md:text-white md:bg-transparent hover:bg-white hover:text-black transition-colors font-semi-bold flex">
            Launch App
          </button>
          <span className="hidden peer-hover:block text-xs group-hover:flex absolute -bottom-5 md:-bottom-2  md:hidden text-orange-400 font-bold">Mobile is not supported.</span>
        </li>
      </ul>
    </>
  );
}
const menu = [
  /* {
    id: 1,
    title: "Community",
    link: "https://twitter.com/SoulBound_BTC",
    target: "_blank",
  }, */
  {
    id: 2,
    title: "Whitepaper",
    link: "/documents/soulbound-protocol-whitepaper.pdf",
    target: "_blank",
  },
  {
    id: 2,
    title: "Docs",
    link: "https://soulbound-1.gitbook.io/soulbound-btc-allpaper-v2",
    target: "_blank",
  },
  {
    id: 2,
    title: "Audit",
    link: "/documents/smart_contract_security_audit_report.pdf",
    target: "_blank",
  },
  {
    id: 3,
    title: "Mint BRC-20",
    link: "/brc20",
    target: "_self",
    comingSoon: false,
  },
  {
    id: 4,
    title: "Mint RGB-20",
    link: "#",
    target: "_self",
    comingSoon: true,
  },
  {
    id: 5,
    title: "Create Taproot Assets",
    link: "#",
    target: "_self",
    comingSoon: true,
  },
  {
    id: 6,
    title: "Launch App",
    link: "/buy-badge",
    target: "_self",
    addClass:
      "border-2 border-white rounded-full px-6 py-2 bg-white text-black md:text-white md:bg-transparent hover:bg-white hover:text-black transition-colors font-semi-bold hidden md:flex ",
  },
];
