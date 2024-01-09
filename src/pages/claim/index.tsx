import Modal from "@/components/Modal";
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
          const claim = await pb
            .collection("soulbound_whitelist")
            .update(check.id, {
              claimed: true,
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
            setMsg("Claimed");
          } else {
            setMsg("Error");
          }
        } else {
          setMsg("You are not whitelisted");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function claim() {
    console.log("claiming");
  }
  return (
    <>
      {show && <Header />}
      <div className="text-2xl  md:text-5xl w-full md:w-2/3 xl:w-1/2  h-fit text-center z-20  fixed top-1/2 left-1/2  flex items-center flex-col transform -translate-x-1/2 -translate-y-1/2 gap-6 text-white launch animate-fadeIn3">
        <h2 className="text-4xl">Claim Badge Airdrop</h2>
        {msg ? msg :<button
          onClick={connect}
          className="border-2 border-white hover:text-black animate-fadeIn rounded-md py-2 px-8 w-fit text-xl hover:bg-white transition-all"
        >
          Connect
        </button>}
      </div>
      {show && <Footer status={true} />}
    </>
  );
}
