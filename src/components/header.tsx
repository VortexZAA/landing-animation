import Link from "next/link";
import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/router";
import DropDownSelect from "./tailwind/dropDownSelect";

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
        className={`w-full backdrop-blur-sm text-white bg-white/5 fixed left-0 top-0 flex items-center h-16 xl:h-20 py-2 xl:py-3 gap-6 justify-center   z-50 transition-colors animate-fadeIn`}
      >
        <div className="flex justify-between px-3 xl:px-6 2xl:px-12 w-full h-full  items-center">
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
          <ul className="flex-col w-full   hidden xl:flex xl:relative pt-12 xl:pt-0 bottom-0 left-0 items-center justify-center h-full  xl:h-auto xl:flex-row xl:mt-0 text-sm xl:text-sm font-normal  gap-6 2xl:gap-10 transition-all">
            {menu.map((item, index) => {
              return (
                <li
                  key={index}
                  className="flex flex-col justify-center group items-center  shrink-0 w-fit relative"
                >
                  {item?.dropdown ? (
                    <>
                      <DropDownSelect textBtn={item.title}>
                        <div className="bg-white/10 backdrop-blur-md text-white rounded-md font-medium border-2 border-white/50 flex flex-col w-32 divide-y-2  ">
                          {item.children.map((child, index) => {
                            return (
                              <>
                                <Link
                                  href={child.link}
                                  target={child.target}
                                  key={index}
                                  onClick={() => setShowMobile(!showMobile)}
                                  className={` justify-center items-center px-3 py-2 xl:border-0 xl:hover:text-orange-400 transition-colors cursor-pointer text-center w-full text-xs ${child?.addClass} `}
                                >
                                  {child.title}
                                  {child.comingSoon && (
                                    <div className="text-xs flex w-full justify-center text-orange-400 font-semibold">
                                      Coming soon
                                    </div>
                                  )}
                                </Link>
                              </>
                            );
                          })}
                        </div>
                      </DropDownSelect>
                    </>
                  ) : (
                    <Link
                      href={item.link}
                      target={item.target}
                      className={`flex justify-center items-center py-3 xl:hover:text-orange-400 transition-colors cursor-pointer text-center w-full font-bold ${item?.addClass} `}
                    >
                      {item.title}
                    </Link>
                  )}
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
              className="block xl:hidden shrink-0"
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setShowMobile(true)}
              className="block xl:hidden space-y-[6px] shrink-0"
            >
              <span className="block w-6 h-[3px] md:h-1 bg-gray-100"></span>
              <span className="block w-6 h-[3px] md:h-1 bg-gray-100"></span>
              <span className="block w-6 h-[3px] md:h-1 bg-gray-100"></span>
            </button>
          )}
        </div>
      </header>
      <ul
        className="flex xl:hidden z-40 flex-col fixed  bg-black xl:bg-transparent xl:relative  top-0 left-0 items-center justify-center xl:justify-end  xl:h-auto xl:flex-row xl:mt-0 text-xl font-normal w-full xl:w-1/2 gap-6 text-white transition-all h-screen overflow-y-auto"
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
              {item?.dropdown ? (
                <>
                  <DropDownSelect textBtn={item.title}>
                    <div className="bg-white/10 backdrop-blur-md text-white rounded-md font-medium border-2 border-white/50 flex flex-col w-32 divide-y-2  ">
                      {item.children.map((child, index) => {
                        return (
                          <>
                            <Link
                              href={child.link}
                              target={child.target}
                              key={index}
                              onClick={() => setShowMobile(!showMobile)}
                              className={` justify-center items-center px-3 py-2 xl:border-0 xl:hover:text-orange-400 transition-colors cursor-pointer text-center w-full text-xs ${child?.addClass} `}
                            >
                              {child.title}
                              {child.comingSoon && (
                                <div className="text-xs flex w-full justify-center text-orange-400 font-semibold">
                                  Coming soon
                                </div>
                              )}
                            </Link>
                          </>
                        );
                      })}
                    </div>
                  </DropDownSelect>
                </>
              ) : (
                <Link
                  href={item.link}
                  target={item.target}
                  onClick={() => setShowMobile(!showMobile)}
                  className={` justify-center items-center py-0 !text-white xl:border-0 xl:hover:text-orange-400 transition-colors cursor-pointer text-center w-full ${item?.addClass} `}
                >
                  {item.title}
                </Link>
              )}
              {item.comingSoon && (
                <span className="text-xs group-hover:flex absolute -bottom-3 md:-bottom-2  md:hidden text-orange-400 font-bold">
                  Coming soon
                </span>
              )}
            </li>
          );
        })}
        <li className="flex flex-col md:hidden group text-white justify-center items-center py-0 -mt-2  xl:border-0 xl:hover:text-orange-400 transition-colors cursor-pointer text-center w-full relative">
          <button className=" justify-center items-center peer  xl:border-0 xl:hover:text-orange-400  cursor-pointer text-center w-fullborder-2 border-white rounded-full px-6 py-2 bg-white text-black md:text-white md:bg-transparent hover:bg-white hover:text-black transition-colors font-semi-bold flex">
            Launch App
          </button>
          <span className="hidden peer-hover:block text-xs group-hover:flex absolute -bottom-5 md:-bottom-2  md:hidden text-orange-400 font-bold">
            Mobile is not supported.
          </span>
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
    id: 0,
    title: "Whitepaper",
    link: "/documents/soulbound-protocol-whitepaper.pdf",
    target: "_blank",
  },
  /* {
    id: 1,
    title: "Partners",
    link: "/partners",
    target: "_self",
  }, */
  {
    id: 2,
    title: "Blog",
    link: "https://medium.com/@soulboundbtc",
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
    title: "Minting Tool",
    link: "#",
    dropdown: true,
    children: [
      {
        id: 1,
        title: "Mint BRC-20",
        link: "/brc20",
        target: "_self",
        addClass: "",
      },
      {
        id: 2,
        title: "Mint RGB-20",
        link: "#",
        target: "_self",
        addClass: "",
        comingSoon: true,
      },
      {
        id: 5,
        title: "Create Taproot Assets",
        link: "#",
        target: "_self",
        comingSoon: true,
      },
    ],
    target: "_self",
    comingSoon: false,
  },
  /* {
    id: 4,
    title: "Mint RGB-20",
    link: "#",
    target: "_self",
    comingSoon: true,
  }, */
  /* {
    id: 5,
    title: "Create Taproot Assets",
    link: "#",
    target: "_self",
    comingSoon: true,
  }, */
  {
    id: 6,
    title: "Claim Badge Airdrop",
    link: "#",//"/claim",
    target: "_self",
    comingSoon: true,
  },
  {
    id: 7,
    title: "Join Badge Whitelist",
    link: "/whitelist",
    target: "_self",
    addClass:
      "border-2 border-white rounded-full px-6 py-2 bg-white text-black md:text-white md:bg-transparent hover:bg-white hover:text-black transition-colors font-semi-bold hidden md:flex ",
  },
  {
    id: 8,
    title: "Launch App",
    link: "/buy-badge",
    target: "_self",
    addClass:
      "border-2 border-white rounded-full px-6 py-2 bg-white text-black md:text-white md:bg-transparent hover:bg-white hover:text-black transition-colors font-semi-bold hidden md:flex ",
  },
];
