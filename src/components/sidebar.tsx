import Link from "next/link";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import { ethers } from "ethers";
import Ethers from "@/lib/ethers";
import CopyBtn from "./button/copyBtn";
import {
  callGetNFT,
  callGetNFTInfo,
  callHasMinted,
  callMint,
  callTokenURI,
  importToMetamask,
  parseIntHex,
} from "@/contractInteractions/useAppContract";
import { ToastError, ToastSuccess } from "./alert/SweatAlert";
import { useAppDispatch, useAppSelector } from "@/hook/redux/hooks";
import {
  setNftInfo,
  setVipLvl,
  setEmty,
  setClear,
  selectData,
  setAddress,
  setLoading,
  setnftId,
  setDownlines,
  setReferralIncome,
  setLvl,
  setLowPotentiel,
  setChainId,
  setIsMobile,
} from "@/redux/auth/auth";
import Image from "next/image";
import CloseBtn from "./icons/close";
import { bigetConnect, bigetSwitch } from "@/lib/biget";
import Modal from "./Modal";
import ChainData from "@/data/chain.json";
import pb from "@/lib/pocketbase";
import useDisconnect from "@/hook/useDisconnect";
import useGetID from "@/hook/useGetID";
import useMetamask from "@/hook/useMetamask";
import { Menu } from "@/data/menu";
import useHelsinki from "@/hook/useHelsinki";
import useOkx from "@/hook/useOkx";
import useHelper from "@/hook/helper";

export default function SideBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const reduxData = useAppSelector(selectData);
  const { address, isEmty, chainId, loading } = reduxData;
  const dispatch = useAppDispatch();
  const { disconnect } = useDisconnect();
  const { getID } = useGetID();
  const [modal, setModal] = useState(false);
  const { joinHelsinki, GhostModal } = useHelsinki({
    address,
  });
  const menu = Menu({ joinHelsinki });
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    chainId && localStorage.setItem("chainId", chainId);
  }, [chainId]);
  useEffect(() => {
    const localChainId = localStorage.getItem("chainId") || "0x5dd";
    dispatch(setChainId(localChainId));
    //setIsMobile(window.innerWidth < 768)
  }, []);
  function Close() {
    setIsOpen(false);
  }
  const { CheckChain, connecWallet } = isMobile
    ? useOkx({
        modal,
        Close,
        address,
        chainId,
      })
    : useMetamask({ modal, Close, address, chainId });

  useEffect(() => {
    const local = localStorage.getItem("address");
    if (local && local !== address) {
      dispatch(setAddress(local));
    }
    const LocalIsEmty = localStorage.getItem("isEmty");
    if (LocalIsEmty) {
      const parsed = LocalIsEmty && JSON.parse(LocalIsEmty);
      dispatch(setEmty(parsed.isEmty));
    }
  }, [address]);

  useEffect(() => {
    dispatch(setLoading(false));
    getID(address);
  }, [address]);
  //console.log("loading0",loading);

  async function BigetConnect() {
    try {
      await bigetConnect();
      await bigetSwitch(chainId);

      /*  */
    } catch (error) {
      console.log(error);
    }
  }

  //console.log("chainId", chainId);

  const seletWallets = [
    {
      name: "Metamask Wallet",
      icon: <img src="/metamask2.svg" alt="" className="h-2/3" />,
      onclick: connecWallet,
    },
    {
      name: "OKX Wallet",
      icon: <img src="/okx.svg" alt="" className="h-full" />,
      onclick: connecWallet,
    },
    {
      name: "TokenPocket Wallet",
      icon: <img src="/tokenpocket.png" alt="" className="h-full" />,
      onclick: connecWallet,
    },
    {
      name: "Bitget Wallet",
      icon: <img src="/bitget.svg" alt="" className="h-full" />,
      onclick: BigetConnect,
    },
  ];

  console.log("isMobile", isMobile);

  return (
    <>
      {GhostModal}
      <nav className=" flex flex-col backdrop-blur-sm bg-white/10 w-fit xl:w-64 shrink-0 border-solid h-screen top-0  justify-between items-center text-white px-3 md:px-4 pb-6 md:pb-10 pt-3 md:pt-6 gap-3 md:gap-6 transition-  text-sm fixed z-50">
        <Link href={"/"} className="w-full md:-ml-0">
          <Image
            src={"/logo.png"}
            width={500}
            height={500}
            className="w-12 h-fit xl:w-20"
            alt="logo"
          />
        </Link>
        <ul className="w-full h-full overflow-y-auto">
          {menu.map(
            (item) =>
              item.status && (
                <li
                  key={item.id}
                  className={`mb-4 flex flex-col gap-3 group items-center cursor-pointer w-full rounded-md transition-colors hover:bg-gray-200 hover:text-gray-700 relative  ${
                    router.pathname === item.path &&
                    "!bg-btnActive text-white hover:text-white "
                  }`}
                >
                  <Link
                    onClick={item?.onclick}
                    target={item.target || "_self"}
                    className="flex justify-center items-center xl:justify-start gap-3 h-full w-full p-3"
                    href={item.path}
                  >
                    {item.icon}

                    {item.comingSoon ? (
                      <>
                        <span className="animate-fadeIn text-orange-600 font-medium xl:group-hover:flex hidden">
                          Coming Soon
                        </span>
                        <span className="  hidden xl:block group-hover:hidden">
                          {item.name}
                        </span>
                      </>
                    ) : (
                      <span className=" hidden xl:block">{item.name}</span>
                    )}
                  </Link>
                </li>
              )
          )}
        </ul>
        {isOpen && (
          <div className="bg-white text-black rounded-lg  pb-6 pt-3 w-60 absolute bottom-36 left-6 border flex flex-col font-bold text-base ">
            <div className="flex w-full justify-between px-3">
              <span>Connect Wallet</span>
              <button type="button" onClick={Close}>
                <CloseBtn />
              </button>
            </div>
            <div className="flex flex-col gap-3 mt-3 px-6 text-black ">
              <button
                onClick={() => {
                  setModal(true);
                  //setSelectedChain("0x38");
                  dispatch(setChainId("0x38"));
                }}
                className="w-full hidden md:flex h-12 p-3 border-2  justify-start items-center transition-colors text-xs gap-2 rounded-md"
              >
                <img src="/bnb.svg" alt="" className="h-full" />
                BNB Chain
              </button>
              <button
                onClick={() => {
                  //setSelectedChain("0x5dd");
                  dispatch(setChainId("0x5dd"));
                  setModal(true);
                }}
                className="w-full h-12 p-3 border-2 hidden md:flex justify-start items-center transition-colors text-xs gap-2 rounded-md"
              >
                <img src="/bevm.svg" alt="" className="h-full" />
                Chain
              </button>
              <button
                onClick={() => {
                  //setSelectedChain("0x5dd");
                  dispatch(setChainId("0x5dd"));

                  connecWallet();
                }}
                className="w-full h-12 p-3 border-2 flex justify-start items-center transition-colors text-xs gap-2 rounded-md"
              >
                <img src="/bevm.svg" alt="" className="h-full" />
                Chain
              </button>
            </div>
          </div>
        )}
        {address ? (
          <div className="text-center border-4 border-purple w-full shrink-0  rounded-lg py-2 px-2 xl:px-4 text-xs flex gap-2 items-center ">
            <img src="/metamask2.svg" className="h-6" alt="" />
            <span className="hidden xl:block">
              {address &&
                address.slice(0, 7) +
                  "....." +
                  address.slice(address.length - 7, address.length)}
            </span>
            <span className="hidden xl:block">
              <CopyBtn text={address} />
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-fit xl:w-full p-3 h-12 bg-purple hover:bg-purple/90 transition-colors text-white rounded-md xl:mx-6"
          >
            <span className="hidden xl:block">Connect Wallet</span>
            <span className="block xl:hidden h-6 w-6 text-white">
              <Image src={"/wallet.svg"} width={500} height={500} alt="" />
            </span>
          </button>
        )}
        {address && (
          <button
            type="button"
            onClick={disconnect}
            className="w-fit xl:w-full p-3 md:-mt-3 h-12 bg-red-500 hover:bg-500/90 transition-colors text-white rounded-md xl:mx-6"
          >
            <span className="hidden xl:block">Disconnect</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className=" block xl:hidden h-full w-fit"
              viewBox="0 0 512 512"
            >
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
            </svg>
          </button>
        )}
      </nav>
      <Modal
        title="Select Wallet"
        modal={address ? false : modal}
        setModal={setModal}
      >
        <div className="grid grid-cols-2 gap-3  px-6 text-black  font-bold p-6 bg-white">
          {seletWallets.map((item) => (
            <button
              key={item.name}
              onClick={item.onclick}
              className="w-full flex h-12 p-3 border-2  justify-start items-center transition-colors text-xs gap-2 rounded-md"
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
