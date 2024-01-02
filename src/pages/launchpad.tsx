import React, { useState } from "react";
import Layout from "@/layout/layout";
import { ethers } from "ethers";
import { useEffect } from "react";
import { Alert } from "@/components/alert/alert";
import { useAppDispatch, useAppSelector } from "@/hook/redux/hooks";
import { selectData, setLoading } from "@/redux/auth/auth";
import { useRouter } from "next/router";
import Project from "@/components/project";

export default function NftBuy() {



  return (
    <>
      

      <Layout title="Launchpad">
        <div className="flex w-full justify-center items-center xl:h-[85vh] text-white">
          <div className="items-center justify-center w-full grid md:grid-cols-2 lg:grid-cols-3 h-full lg:h-2/3 gap-3 md:gap-4 xl:gap-6">
            <div className="backdrop-blur-sm bg-white/10 border-2 border-white/30 rounded-xl shadow-md w-full gap-6 h-full py-4 p-6 md:p-6 min-h-[40vh]  flex flex-col justify-center relative">
              <Project text="Project 1" />
              <div className="flex  justify-center items-center gap-3 border-2 p-6 border-vip1 rounded-md">
                Coming Soon
              </div>
              
            </div>
            <div className="backdrop-blur-sm bg-white/10 border-2 border-white/30 rounded-xl shadow-md w-full gap-6 h-full py-4 p-6 md:p-6 min-h-[40vh]  flex flex-col justify-center relative">
              <Project text="Project 2" />
              <div className="flex  justify-center items-center gap-3 border-2 p-6 border-vip2 rounded-md">
                Coming Soon
              </div>
              
            </div>
            <div className="backdrop-blur-sm bg-white/10 border-2 border-white/30 rounded-xl shadow-md w-full gap-6 h-full py-4 p-6 md:p-6 min-h-[40vh]  flex flex-col justify-center relative">
              <Project text="Project 3" />
              <div className="flex justify-center items-center  gap-3 border-2 p-6 border-vip3 rounded-md">
                Coming Soon
              </div>
              
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
