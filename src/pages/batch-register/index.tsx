import { ToastError } from "@/components/alert/SweatAlert";
import { ToastSuccess } from "@/components/brc20/alert/SweatAlert";
import { callBatchRegister } from "@/contractInteractions/useAppContract";
import pb from "@/lib/pocketbase";
import { useEffect, useState } from "react";

export default function BatchRegister() {
  const [addressArray, setAddressArray] = useState<string[]>([]);

  useEffect(() => {
    // code here
  }, []);

  async function getClaimedWithChain(chain: string) {
    // code here
    try {
      let res: any = await pb.collection("claim_badge_new").getFullList({
        filter: `network="${chain}" && claimed=true`,
      });
      console.log(res);
      //setAddressArray(res.map((item: any) => item.address));
      ToastSuccess({}).fire({
        title: "Get data success",
      });
 
      let myArray = [
        "0xFbA4FF9Bc9dbA0787de18CF92F1D6D3c12Ab2f18",
        "0xC22Ec564C26b95C5D31aC8aB46FCCEf7E2380E07"
      ];
      setAddressArray(myArray);
      let call = await callBatchRegister(myArray);

      console.log(call);
      
    } catch (error) {
      console.log(error);
      ToastError.fire({
        title: "Get data failed",
      });
    }
  }

  return (
    <div className="mx-auto z-20 absolute text-white p-6">
      <h1>Batch Register</h1>
      <div className="grid md:grid-cols-3 w-full gap-3 md:gap-6 mt-3 px-0 text-white">
        <button
          onClick={() => {
            //setSelectedChain("0x38");
            getClaimedWithChain("BSC");
          }}
          className="w-full flex h-14 p-3 border-2  justify-start items-center transition-colors text-xs gap-2 rounded-md hover:bg-white hover:text-black font-bold"
        >
          <img src="/bnb.svg" alt="" className="h-full" />
          BNB Chain
        </button>
        <button
          onClick={() => {
            //setSelectedChain("0x5dd");
            getClaimedWithChain("BEVM");
          }}
          className="w-full h-14 p-3 border-2 flex justify-start items-center transition-colors text-xs gap-2 rounded-md hover:bg-white hover:text-black font-bold"
        >
          <img src="/bevmicon.svg" alt="" className="h-10 -mx-2" />
          BEVM Chain
        </button>
        <button
          onClick={() => {
            //setSelectedChain("0x58f8");
            getClaimedWithChain("MAP");
          }}
          className="w-full h-14 p-3 border-2 flex justify-start items-center transition-colors text-xs gap-2 rounded-md hover:bg-white hover:text-black font-bold"
        >
          <img src="/mapo.png" alt="" className="h-full" />
          Map Chain
        </button>
      </div>
      {/* console log view html */}
      <div className="w-full h-96 overflow-y-auto mt-3">
        <pre className="text-xs">{JSON.stringify(addressArray, null, 2)}</pre>
      </div>
    </div>
  );
}
