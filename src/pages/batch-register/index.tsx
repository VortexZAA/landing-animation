import { ToastError } from "@/components/alert/SweatAlert";
import { ToastSuccess } from "@/components/brc20/alert/SweatAlert";
import { callBatchRegister } from "@/contractInteractions/useAppContract";
import Ethers from "@/lib/ethers";
import pb from "@/lib/pocketbase";
import { useEffect, useState } from "react";

export default function BatchRegister() {
  const [addressArray, setAddressArray] = useState<string[]>([]);
  const [selectedChain, setSelectedChain] = useState<string>("");

  useEffect(() => {
    // code here

    //@ts-ignore
    window.ethereum?.on("chainChanged", (chainId) => {
      setSelectedChain(chainId);
      console.log(chainId);
      localStorage.setItem("chainId", chainId);
    });
  });

  useEffect(() => {
    checkChain();
  }, []);

  async function checkChain() {
    const { provider, ethereum } = Ethers();
    // get hex chainId
    let chainId = await provider.getNetwork();
    console.log(chainId);
    // convert to hex  chainId
    let hexChainId = "0x" + chainId.chainId.toString(16);
    console.log(hexChainId);
    setSelectedChain(hexChainId);
    localStorage.setItem("chainId", hexChainId);
  }

  async function getClaimedWithChain(chain: string) {
    // code here
    try {
      const { provider, ethereum } = Ethers();
      await ethereum.send("eth_requestAccounts");
      const signer = provider.getSigner();
      // get chain
      let chainId = await provider.getNetwork();
      const optionArray = ["","epic","legendary"]
      let option : number = 1;
      let res: any = await pb.collection("claim_badge_new2").getFullList({
        filter: `network="${chain}" && claimed=true && registered=false && status="${optionArray[option-1]}"`,
      });

      console.log(res);
      setAddressArray(res);
      ToastSuccess({}).fire({
        title: "Get data success",
      });
      
      let ids = res.map((item: any) => item.id);
      let myArray = res.map((item: any) => item.address);

      let call = await callBatchRegister(myArray, option);

      if (call.hash) {
        ToastSuccess({}).fire({
          title: "Batch register success",
        });
        //update claim_badge_new2 registered=true
        ids.forEach(async (id: any) => {
          let res = await pb
            .collection("claim_badge_new2")
            .update(id, {
              registered: true,
            })
            .then((res: any) => {
              console.log(res);
            })
            .catch((err: any) => {
              console.log(err);
              ToastError.fire({
                title: id + " update failed",
              });
            });
        });
      }
      console.log(call);
    } catch (error) {
      console.log(error);
      ToastError.fire({
        title: "Get data failed",
      });
    }
  }

  async function changeRegistered(id: string) {
    try {
      let res = await pb
        .collection("claim_badge_new2")
        .update(id, {
          registered: true,
        })
        .then((res: any) => {
          console.log(res);
          ToastSuccess({}).fire({
            title: id + " update success",
          });
        })
        .catch((err: any) => {
          console.log(err);
          ToastError.fire({
            title: id + " update failed",
          });
        });
    } catch (error) {
      console.log(error);
      ToastError.fire({
        title: id + " update failed",
      });
    }
  }

  return (
    <div className="mx-auto z-20 absolute text-white p-6">
      <h1>Batch Register</h1>
      <div className="grid md:grid-cols-3 w-full gap-3 md:gap-6 mt-3 px-0 text-white">
        {selectedChain === "0x38" && (
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
        )}
        {selectedChain === "0x5dd" && (
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
        )}
        {selectedChain === "0x58f8" && (
          <button
            onClick={() => {
              //setSelectedChain("0x58f8");
              getClaimedWithChain("POLYGON");
            }}
            className="w-full h-14 p-3 border-2 flex justify-start items-center transition-colors text-xs gap-2 rounded-md hover:bg-white hover:text-black font-bold"
          >
            <img src="/mapo.png" alt="" className="h-full" />
            Map Chain
          </button>
        )}
      </div>
      {/* console log view html */}
      <div className="w-full h-full flex flex-col gap-3 text-white overflow-y-auto mt-3">
        {addressArray.map((item: any, index: number) => {
          return (
            <div
              key={index}
              className="w-full h-12  p-3 border-2 flex justify-between items-center transition-colors text-xs gap-2 rounded-md hover:bg-white hover:text-black font-bold"
            >
              <div className="flex gap-2">
                <span>{item.address}</span>
                <span>{item.network}</span>
              </div>
              <button
                onClick={() => {
                  changeRegistered(item.id);
                }}
                className="w-20 h-8 bg-green-500 rounded-md"
              >
                Register
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}