import Modal from "@/components/Modal";
import { ToastError } from "@/components/alert/SweatAlert";
import Footer from "@/components/footer";
import Header from "@/components/header";
import pb from "@/lib/pocketbase";
import { ethers } from "ethers";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

const FluidAnimation = dynamic(() => import("@/components/FluidAnimation"), {
  ssr: false,
});
export default function Intro() {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [selectNetwork, setSelectedNetwork] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState({ id: "", claimed: false, network: "" });
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 700);
    //reload
  }, []);
  async function connect() {
    try {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const sing = await signer.signMessage("claim check");
      const address = await signer.getAddress();
      console.log(address);
      if (sing) {
        const check: any = await pb
          .collection("soulbound_whitelist")
          .getFirstListItem(`address="${address}"`)
          .then((res) => {
            console.log(res);
            return res;
          })
          .catch((err) => {
            console.log(err);
            return false;
          });
        console.log("check", check);
        if (check) {
          setMsg("You are whitelisted");
          setIsOpen(true);
          setUserId(check);
        } else {
          setMsg("You are not eligible 😦");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function claim(network: string) {
    console.log("claiming");
    try {
      if (!userId.claimed) {
        const claim = await pb
          .collection("soulbound_whitelist")
          .update(userId.id, {
            claimed: true,
            network: network,
          })
          .then((res) => {
            console.log(res);
            return true;
          })
          .catch((err) => {
            console.log(err);
            return false;
          });
        console.log("claim", claim);
        if (claim) {
          setMsg(
            `Your badge will be sent to your wallet on the ${network} network`
          );
        } else {
          ToastError.fire({
            title: "Something went wrong please try again later",
          });
        }
      } else {
        setMsg(`You have already ${userId.network} network claimed your badge`);
      }
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      {show && <Header />}
      <div className="text-xl  md:text-2xl w-full md:w-2/3 xl:w-1/2  h-fit text-center z-20  fixed top-1/2 left-1/2  flex items-center flex-col transform -translate-x-1/2 -translate-y-1/2 gap-6 text-white launch animate-fadeIn3">
        <h2 className="text-4xl">Claim Badge Airdrop</h2>
        {msg ? (
          msg
        ) : (
          <button
            onClick={connect}
            className="border-2 border-white hover:text-black animate-fadeIn rounded-md py-2 px-8 w-fit text-xl hover:bg-white transition-all"
          >
            Connect
          </button>
        )}
        {isOpen && (
          <div className=" text-white flex flex-col -mt-3 font-bold text-base gap-2 ">
            <h4 className="font-semibold">Select Network</h4>
            <div className="grid md:grid-cols-3 gap-3 md:gap-6 mt-3 px-6 text-white">
              <button
                onClick={() => {
                  //setSelectedChain("0x38");
                  claim("BSC");
                }}
                className="w-full flex h-12 p-3 border-2  justify-start items-center transition-colors text-xs gap-2 rounded-md"
              >
                <img src="/bnb.svg" alt="" className="h-full" />
                BNB Chain
              </button>
              <button
                onClick={() => {
                  //setSelectedChain("0x5dd");
                  claim("BEVM");
                }}
                className="w-full h-12 p-3 border-2 flex justify-start items-center transition-colors text-xs gap-2 rounded-md"
              >
                <img src="/bevmicon.svg" alt="" className="h-8 -mx-2" />
                BEVM Chain
              </button>
              <button
                onClick={() => {
                  //setSelectedChain("0x58f8");
                  claim("MAP");
                }}
                className="w-full h-12 p-3 border-2 flex justify-start items-center transition-colors text-xs gap-2 rounded-md"
              >
                <img src="/mapo.png" alt="" className="h-full" />
                Map Chain
              </button>
            </div>
          </div>
        )}
      </div>
      {show && <Footer status={true} />}
    </>
  );
}
