"use client";
import Vip from "@/components/vip";
import React, { use, useState } from "react";
import Layout from "@/layout/layout";
import {
  callRegister,
  callGetNFTPrice,
} from "@/contractInteractions/useAppContract";
import Ethers from "@/lib/ethers";
import { ethers } from "ethers";
import { useEffect } from "react";
import { Alert } from "@/components/alert/alert";
import { ToastError, ToastSuccess } from "@/components/alert/SweatAlert";
import Loading from "@/components/loading";
import { useAppDispatch, useAppSelector } from "@/hook/redux/hooks";
import { selectData, setLoading } from "@/redux/auth/auth";
import { useRouter } from "next/router";
import BtcIcon from "@/components/icons/btc";
import BnbIcon from "@/components/icons/bnb";

export default function NftBuy() {
  function parseTo18Decimals(number: number) {
    try {
      const parsed = ethers.utils.parseUnits(number.toString(), 18);
      return parsed.toString();
    } catch (error) {
      console.log(error);
      return "";
    }
  }

  const [uInput1, setuInput1] = useState("");
  const [uInput2, setuInput2] = useState("");
  const [uInput3, setuInput3] = useState("");
  const [alert, setAlert]: any = useState(null);
  const [price, setPrice]: any = useState({
    vip1: 250,
    vip2: 500,
    vip3: 1000,
  });
  const { loading, address, chainId } = useAppSelector(selectData);
  const dispatch = useAppDispatch();
  const router = useRouter();
  //console.log("loading", loading);
  async function buyVip1() {
    try {
      //@ts-ignore
      const chainIdMetamask = await ethereum?.request({
        method: "eth_chainId",
      });
      console.log("chainId", chainId, "getChainId", chainIdMetamask);
      if (chainIdMetamask !== chainId) {
        ToastError.fire({
          title: "Please Change Network",
        });
        return;
      }
      dispatch(setLoading(true));
      console.log([uInput1, 1]);
      // random number 1-2
      const rndNumber = Math.floor(Math.random() * 2);
      const tempInput1 = uInput1 || childRef[rndNumber];
      console.log("tempInput1", tempInput1);

      const tx: any = await callRegister(tempInput1, 1, address);
      tx &&
        ToastSuccess({
          tHashLink: tx.hash,
        }).fire({
          title: "Transaction Successful",
        });
      //router.push("/my-account");
    } catch (error) {
      console.log(error);
      ToastError.fire({
        title: "Transaction Failed",
      });
      dispatch(setLoading(false));
    } finally{
      dispatch(setLoading(false));
    }
  }
  const refVip1 = (event: any) => {
    setuInput1(event.target.value);
  };
  const childRef = [
    process.env.NEXT_PUBLIC_LEFT_NODE as string,
    process.env.NEXT_PUBLIC_RIGHT_NODE as string,
  ];
  async function buyVip2() {
    try {
      //@ts-ignore
      const chainIdMetamask = await ethereum?.request({
        method: "eth_chainId",
      });
      console.log("chainId", chainId, "getChainId", chainIdMetamask);
      if (chainIdMetamask !== chainId) {
        ToastError.fire({
          title: "Please Change Network",
        });
        return;
      }
      dispatch(setLoading(true));
      console.log([uInput2, 2]);
      // random number 1-2
      const rndNumber = Math.floor(Math.random() * 2);
      const tempInput2 = uInput2 || childRef[rndNumber];
      console.log("tempInput2", tempInput2);

      const tx: any = await callRegister(tempInput2, 2, address);
      tx &&
        ToastSuccess({
          tHashLink: tx.hash,
        }).fire({
          title: "Transaction Successful",
        });
      router.push("/my-account");

      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      ToastError.fire({
        title: "Transaction Failed",
      });
      dispatch(setLoading(false));
    }
  }
  const refVip2 = (event: any) => {
    setuInput2(event.target.value);
  };

  async function buyVip3() {
    try {
      //@ts-ignore
      const chainIdMetamask = await ethereum?.request({
        method: "eth_chainId",
      });
      console.log("chainId", chainId, "getChainId", chainIdMetamask);
      if (chainIdMetamask !== chainId) {
        ToastError.fire({
          title: "Please Change Network",
        });
        return;
      }
      dispatch(setLoading(true));
      console.log([uInput3, 3]);
      // random number 1-2
      const rndNumber = Math.floor(Math.random() * 2);
      const tempInput3 = uInput3 || childRef[rndNumber];
      const tx: any = await callRegister(tempInput3, 3, address);
      tx &&
        ToastSuccess({
          tHashLink: tx.hash,
        }).fire({
          title: "Transaction Successful",
        });
      router.push("/my-account");

      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      ToastError.fire({
        title: "Transaction Failed",
      });
      dispatch(setLoading(false));
    }
  }
  const refVip3 = (event: any) => {
    setuInput3(event.target.value);
  };
  const [sats, setSats] = useState({
    sats1: 0,
    sats2: 0,
    sats3: 0,
  });
  // get btc price from binance
  async function getPrice() {
    try {
      dispatch(setLoading(true));
      //console.log("loadin1", loading);

      setPrice({
        vip1: 100,
        vip2: 500,
        vip3: 1000,
      });
      const sats1 = ethers.utils.formatEther(await callGetNFTPrice(1));
      const sats2 = ethers.utils.formatEther(await callGetNFTPrice(2));
      const sats3 = ethers.utils.formatEther(await callGetNFTPrice(3));
      let newSats = {
        sats1: Number(sats1),
        sats2: Number(sats2),
        sats3: Number(sats3),
      };
      console.log("sats", newSats);
      setSats(newSats);
    } catch (error) {
      console.log(error);
    } finally {
      //console.log("loadin4", loading);
      dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    getPrice();
  }, [chainId]);
  //console.log("sats", sats, "chainId", chainId);

  return (
    <>
      <Layout title="Buy Badge">
        <div className="flex w-full justify-center items-center xl:h-[80vh] text-white pb-20">
          <div className="items-center justify-center w-full grid md:grid-cols-2 lg:grid-cols-3 h-full lg:h-2/3 gap-3 md:gap-4 xl:gap-6">
            <div className="backdrop-blur-sm bg-white/10 border-2 border-white/30 rounded-xl shadow-md w-full gap-10 h-full p-6 flex flex-col justify-between">
              <Vip text="Seed 1" />
              <div className="flex  justify-center items-center gap-3 border-2 p-6 border-vip1 rounded-md">
                {
                  /* chainId === "0x38" ? <BnbIcon /> : <BtcIcon /> */ <BtcIcon />
                }
                {sats.sats1.toFixed(4)}
                {""} = {price?.vip1.toFixed(0)}$
              </div>
              <div className="w-full  flex flex-col gap-3">
                <input
                  type="text"
                  onChange={refVip1}
                  placeholder={"Main Referral Code: " + childRef[0]}
                  className="outline-none border-2 rounded-lg border-gray-200 p-3 text-black"
                />
                <button
                  type="submit"
                  disabled={loading || !address}
                  onClick={buyVip1}
                  className="bg-purple hover:opacity-95 text-white rounded-lg py-3 disabled:opacity-70 disabled:cursor-not-allowed gap-3 w-full flex justify-center items-center"
                >
                  Buy {loading && <Loading />}
                </button>
              </div>
            </div>
            <div className="backdrop-blur-sm bg-white/10 border-2 border-white/30 rounded-xl shadow-md w-full gap-6 h-full p-6 flex flex-col justify-between">
              <Vip text="Seed 2" />
              <div className="flex  justify-center items-center gap-3 border-2 p-6 border-vip2 rounded-md">
                {
                  /* chainId === "0x38" ? <BnbIcon /> : <BtcIcon /> */ <BtcIcon />
                }
                {sats.sats2.toFixed(4)}
                {""} = {price?.vip2?.toFixed(0)}$
              </div>
              <div className="w-full  flex flex-col gap-3">
                <input
                  type="text"
                  onChange={refVip2}
                  placeholder={"Main Referral Code: " + childRef[0]}
                  className="outline-none border-2 rounded-lg border-gray-200 p-3 text-black"
                />
                <button
                  type="submit"
                  disabled={loading || !address}
                  onClick={buyVip2}
                  className="bg-purple hover:opacity-95 text-white rounded-lg py-3 disabled:opacity-70 disabled:cursor-not-allowed w-full gap-3 flex justify-center items-center"
                >
                  Buy {loading && <Loading />}
                </button>
              </div>
            </div>
            <div className="backdrop-blur-sm bg-white/10 border-2 border-white/30 rounded-xl shadow-md w-full gap-6 h-full p-6 flex flex-col justify-between">
              <Vip text="Seed 3" />
              <div className="flex justify-center items-center  gap-3 border-2 p-6 border-vip3 rounded-md">
                {
                  /* chainId === "0x38" ? <BnbIcon /> : <BtcIcon /> */ <BtcIcon />
                }
                {sats.sats3.toFixed(4)}
                {""} = {price?.vip3?.toFixed(0)}$
              </div>
              <div className="w-full  flex flex-col gap-3">
                <input
                  type="text"
                  onChange={refVip3}
                  placeholder={"Main Referral Code: " + childRef[0]}
                  className="outline-none border-2 rounded-lg border-gray-200 p-3 text-black"
                />
                <button
                  type="submit"
                  disabled={loading || !address}
                  onClick={buyVip3}
                  className="bg-purple hover:opacity-95 text-white rounded-lg py-3 disabled:opacity-70 disabled:cursor-not-allowed w-full gap-3 flex justify-center items-center"
                >
                  Buy {loading && <Loading />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
