import axios from "axios";
import { ToastError, ToastSuccess } from "./alert/SweatAlert";
import { useState } from "react";
import sendBtc from "./sendBtc";
export default function Deploy({ address }: { address: string }) {
  const [txHash, setTxHash] = useState<any>({});
  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      let data: any = {
        receiveAddress:
          "",
        feeRate: 200,
        outputValue: 1000,
        devAddress:
          "bc1pfae3chrkg05wqachy9e7atspqn54weq36pfjlk607f2nheuzhhasr0cq6m",
        devFee: 0,
        brc20Ticker: "",
        brc20Max: "",
        brc20Limit: "",
      };
      data.receiveAddress = e.target.receivingAddress.value;
      data.brc20Ticker = e.target.ticker.value;
      data.brc20Max = e.target.supply.value;
      data.brc20Limit = e.target.limit.value;

      console.log(data);
      //axios post  https://btchex.v1testmoseiki.online/ data
      const res = await axios.post(
        "https://open-api.unisat.io/v2/inscribe/order/create/brc20-deploy",
        
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+ "8c6a78efb16cfe1c40c939fcaccc8a8abe7c2b35cb3c651677700e5cb30dc1ff",
          },
        }
      );
      //console.log(res);
      console.log(res.data);
      let txHash = ""/*  res?.data?.txid */;
      ToastSuccess({
        tHashLink: txHash,
      }).fire({
        title: "Inscribe Successful",
      });
      let resData = res.data.data
      sendBtc(resData?.payAddress,resData?.amount)
      setTxHash(resData);
    } catch (error: any) {
      console.log(error);
      ToastError.fire({
        title: error?.message || "Something went wrong",
      });
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-white">
      <div className="input-box">
        <div className="input-box_head">
          <div className="input-box_label">Receiving address (taproot)</div>
        </div>
        <div className="input-box_wrap">
          <input
            disabled
            value={address}
            name="receivingAddress"
            placeholder="Enter a taproot address from an ordinals wallet"
            className="input-box_inp py-2 px-6 bg-gray-800 h-12 rounded-lg w-full text-white"
          />
        </div>
      </div>
      <div className="input-box">
        <div className="input-box_head">
          <div className="input-box_label">Ticker</div>
        </div>
        <div className="input-box_wrap">
          <input
            placeholder="e.g. ordi"
            name="ticker"
            className="input-box_inp py-2 px-6 bg-gray-800 h-12 rounded-lg w-full text-white"
            v-model="data.ticker"
          />
        </div>
      </div>
      <div className="input-box">
        <div className="input-box_head">
          <div className="input-box_label">Supply</div>
        </div>
        <div className="input-box_wrap">
          <input
            placeholder="e.g. 1000"
            name="supply"
            className="input-box_inp py-2 px-6 bg-gray-800 h-12 rounded-lg w-full text-white"
          />
        </div>
      </div>
      <div className="input-box">
        <div className="input-box_head">
          <div className="input-box_label">Limit per mint</div>
        </div>
        <div className="input-box_wrap">
          <input
            placeholder="1"
            name="limit"
            className="input-box_inp py-2 px-6 bg-gray-800 h-12 rounded-lg w-full text-white"
          />
        </div>
      </div>
      <div className="flex justify-center w-full">
        <button
          type="submit"
          className="bg-btnActive px-6 py-3 w-2/3 flex text-white rounded-lg text-center justify-center hover:bg-gray-700 hover:text-white transition-colors border border-black hover:border-white text-xl"
        >
          Inscribe
        </button>
      </div>
      {/* PayAddress:{" "+ txHash?.payAddress}
      <br/>
      Amount: {" "+txHash?.amount} sats
      <br/>
      OrderId: {" "+txHash?.orderId}
      <button onClick={()=>sendBtc(txHash?.payAddress,txHash?.amount)} type="button" className="bg-white text-black w-fit p-3 rounded-md">
        Transfer
      </button> */}
    </form>
  );
}
