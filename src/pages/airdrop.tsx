import Vip from "@/components/vip";
import React, { useState } from "react";
import Layout from "@/layout/layout";
import {
  callRegister,
  callApprove,
  callAllowance,
  checkAllowance,
  callGetPrice,
  parseIntHex,
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
import Project from "@/components/project";

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
  const {loading,address } = useAppSelector(selectData)
  const dispatch = useAppDispatch();
  const router = useRouter()

  async function buyVip1() {
    try {
      dispatch(setLoading(true));
      console.log([uInput1, 1]);
      const tempInput1 = uInput1 as unknown;
      const numberInput1 = tempInput1 as number;
      const tx: any = await callRegister(numberInput1, 1, address);
      tx &&
        ToastSuccess({
          tHashLink: tx.hash,
        }).fire({
          title: "Transaction Successful",
        });
      router.push("/dashboard");

      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      ToastError.fire({
        title: "Transaction Failed",
      });
      dispatch(setLoading(false));
    }
  }
  const refVip1 = (event: any) => {
    setuInput1(event.target.value);
  };

  async function buyVip2() {
    try {
      dispatch(setLoading(true));
      console.log([uInput2, 2]);
      const tempInput2 = uInput2 as unknown;
      const numberInput2 = tempInput2 as number;
      const tx: any = await callRegister(numberInput2, 2, address);
      tx &&
        ToastSuccess({
          tHashLink: tx.hash,
        }).fire({
          title: "Transaction Successful",
        });
      router.push("/dashboard");

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
      dispatch(setLoading(true));
      console.log([uInput3, 3]);
      const tempInput3 = uInput3 as unknown;
      const numberInput3 = tempInput3 as number;
      const tx: any = await callRegister(numberInput3, 3, address);
      tx &&
        ToastSuccess({
          tHashLink: tx.hash,
        }).fire({
          title: "Transaction Successful",
        });
      router.push("/dashboard");

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

  return (
    <>
      {alert?.show && <Alert status={alert?.status} text={alert?.text} tHashLink={alert?.tHashLink} />}

      <Layout title="Airdrop">
        <div className="flex w-full justify-center items-center xl:h-[85vh] text-white">
          <div className="items-center justify-center w-full grid md:grid-cols-2 lg:grid-cols-3 h-full lg:h-2/3 gap-3 md:gap-4 xl:gap-6">
            <div className="backdrop-blur-sm bg-white/10 border-2 border-white/30 rounded-xl shadow-md w-full gap-10 h-full p-6 flex flex-col justify-center relative">
              <Project text="Project 1" />
              <div className="flex  justify-center items-center gap-3 border-2 p-6 border-vip1 rounded-md">
                Coming Soon
              </div>
              <div className="w-full   flex-col gap-3 hidden">
                <input
                  type="text"
                  onChange={refVip1}
                  placeholder="Referral Code"
                  className="outline-none border-2 rounded-lg border-gray-200 p-3 text-black"
                />
                <button
                  type="submit"
                  disabled={loading}
                  onClick={buyVip1}
                  className="bg-purple hover:opacity-95 text-white rounded-lg py-3 disabled:opacity-70 disabled:cursor-not-allowed gap-3 w-full flex justify-center items-center"
                >
                  Buy {loading && <Loading/>}
                </button>
              </div>
            </div>
            <div className="backdrop-blur-sm bg-white/10 border-2 border-white/30 rounded-xl shadow-md w-full gap-6 h-full p-6 flex flex-col justify-center relative">
              <Project text="Project 2" />
              <div className="flex  justify-center items-center gap-3 border-2 p-6 border-vip2 rounded-md">
                Coming Soon
              </div>
              <div className="w-full   flex-col gap-3 hidden">
                <input
                  type="text"
                  onChange={refVip2}
                  placeholder="Referral Code"
                  className="outline-none border-2 rounded-lg border-gray-200 p-3 text-black"
                />
                <button
                  type="submit"
                  disabled={loading}
                  onClick={buyVip2}
                  className="bg-purple hover:opacity-95 text-white rounded-lg py-3 disabled:opacity-70 disabled:cursor-not-allowed w-full gap-3 flex justify-center items-center"
                >
                  Buy {loading && <Loading/>}
                </button>
              </div>
            </div>
            <div className="backdrop-blur-sm bg-white/10 border-2 border-white/30 rounded-xl shadow-md w-full gap-6 h-full p-6 flex flex-col justify-center relative">
              <Project text="Project 3" />
              <div className="flex justify-center items-center  gap-3 border-2 p-6 border-vip3 rounded-md">
                Coming Soon
              </div>
              <div className="w-full   flex-col gap-3 hidden">
                <input
                  type="text"
                  onChange={refVip3}
                  placeholder="Referral Code"
                  className="outline-none border-2 rounded-lg border-gray-200 p-3 text-black"
                />
                <button
                  type="submit"
                  disabled={loading}
                  onClick={buyVip3}
                  className="bg-purple hover:opacity-95 text-white rounded-lg py-3 disabled:opacity-70 disabled:cursor-not-allowed w-full gap-3 flex justify-center items-center"
                >
                  Buy {loading && <Loading/>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
