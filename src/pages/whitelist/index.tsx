import Image from "next/image";
import { Inter } from "next/font/google";
import React, { useEffect, useRef, useState } from "react";
import Mint from "@/components/brc20/mint";
import Deploy from "@/components/brc20/deploy";
import Transfer from "@/components/brc20/transfer";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ToastError, ToastSuccess } from "@/components/alert/SweatAlert";
import Ethers from "@/lib/ethers";
import pb from "@/lib/pocketbase";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState("");

  async function connecWallet() {
    try {
      const { provider, ethereum } = Ethers();

      await ethereum.send("eth_requestAccounts");

      const signer = await provider?.getSigner();
      const [address, chainIdNow, networkName] = await Promise.all([
        signer.getAddress(),
        signer.provider
          .getNetwork()
          .then((network: { chainId: any }) => network.chainId),
        signer.provider
          .getNetwork()
          .then((network: { name: any }) => network.name),
      ]);
      setAddress(address);
      // example create data
      const data = {
        address: address,
      };
      let signature = await signer.signMessage(
        JSON.stringify("Join Badge Whitelist")
      );
      console.log(signature);
      const check = await pb
        .collection("soulbound_whitelist")
        .getFirstListItem(`address="${address}"`)
        .then((record: any) => {
          console.log(record);
          return false;
        })
        .catch((error: any) => {
          console.log(error);
          return true;
        });
      if (check) {

        const record = await pb
          .collection("soulbound_whitelist")
          .create(data)
          .then((record: any) => {
            console.log(record);
            //alert("Your wallet is connected successfully.");
          })
          .catch((error: any) => {
            console.log(error);
            ToastError.fire({
              title: "Something went wrong.",
            });
          });
      }
      setIsOpen(true);
      ToastSuccess({}).fire({
        title: "Your wallet is connected successfully.",
      });
      //dispatch(setChainId(chainId));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Header />
      <div className="text-2xl md:block md:text-5xl w-full  h-fit text-center z-20  fixed top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 text-white launch animate-fadeIn3">
        {isOpen ? (
          <>
            <div className="border-2 border-white rounded-2xl text-xl w-2/3 leading-relaxed md:w-1/3 mx-auto p-6">
              {address &&
                address.slice(0, 7) +
                  "..." +
                  address.slice(address.length - 7, address.length)}{" "}
              is connected <br />
              Congratulations! Your submission has been successful. Please
              proceed to Galxe to complete all tasks and qualify for whitelist
              eligibility
            </div>
            <Link href={'#'} target="_blank">
              <button
                className="border-2 border-white rounded-md text-black font-semibold mt-6 py-3 px-10  text-xl bg-white hover:bg-black hover:text-white  transition-all"
              >
                Galxe
              </button>
            </Link>
          </>
        ) : (
          <button
            onClick={connecWallet}
            className="border-2 border-white rounded-md py-3 px-10  text-xl hover:bg-white hover:text-black  transition-all"
          >
            Connect Wallet
          </button>
        )}
      </div>
      <Footer status={true} />
    </>
  );
}
