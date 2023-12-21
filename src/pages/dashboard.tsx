import Image from "next/image";
import { useState } from "react";
import Layout from "@/layout/layout";

import { useEffect } from "react";
import FlowChartWithAutoLayout from "@/components/chart";


export default function Home() {
  const [selected, setSelected] = useState(1);
  const [data, setData]: any = useState();

  /* useEffect(() => {
    let address = localStorage.getItem("address") || "";
    if (address) {
      let nftInfo = localStorage.getItem("nftInfo")
        ? JSON.parse(localStorage.getItem("nftInfo") || "")
        : [{}];
      console.log(nftInfo);
      setData(nftInfo);
    }
  }, []); */

  return (
    <>
      <Layout title="Dashboard">
        <div className="flex flex-col gap-12  h-[85vh] justify-center items-center backdrop-blur-sm bg-white/10 rounded-xl shadow-md w-full overflow-auto ">
          <FlowChartWithAutoLayout tokenId={false} />
        </div>
      </Layout>
    </>
  );
}
