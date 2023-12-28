import Image from "next/image";
import { useState } from "react";
import Layout from "@/layout/layout";

import { useEffect } from "react";
import FlowChartWithAutoLayout from "@/components/chart";
import { useAppDispatch, useAppSelector } from "@/hook/redux/hooks";
import { selectData, setLoading } from "@/redux/auth/auth";
import Loading from "@/components/loading";
import { parseTo18Decimals } from "@/hook/parse18decimals";
import { callRefresh, callWithdraw } from "@/contractInteractions/useAppContract";
import { ToastError, ToastSuccess } from "@/components/alert/SweatAlert";


export default function Home() {
  const [selected, setSelected] = useState(1);
  const [data, setData]: any = useState();
  const reduxData = useAppSelector(selectData);
  const dispatch = useAppDispatch();    
  const {
    withdrawableBalance,
    totalRevenue,
    vipLvl,
    address,
    loading,
    nftId,
    downlines,
    referralIncome,
    lvl,
    lowPotentiel,
  } = reduxData;
  async function handleSubmit() {
    try {
      dispatch(setLoading(true));
      const res: any = await callRefresh();
      console.log(res);
      if (res) {
        ToastSuccess({ tHashLink: res.hash }).fire({
          title: "Transaction Successful",
        });
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      ToastError.fire({
        title: "Something went wrong",
      });
      dispatch(setLoading(false));
    }
  }

  return (
    <>
      <Layout title="Admin">
        <div className="flex flex-col gap-12  h-[85vh] w-full justify-center items-center backdrop-blur-sm bg-white/10 rounded-xl shadow-md overflow-auto ">
          <div className="flex justify-center w-full ">
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="bg-purple  md:w-1/2 xl:w-1/3 py-3 px-6 w-2/3 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 justify-center flex gap-3 items-center  text-xl font-semibold" 
            >
              All Withdraw {loading && <Loading />}
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
}
