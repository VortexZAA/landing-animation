import axios from "axios";
import { ToastError, ToastSuccess } from "./alert/SweatAlert";
import { useState } from "react";
export default function Deploy({address}:{address:string}) {
  const [txHash, setTxHash] = useState("");
  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      let data: any =
        "{ \n" +
        '  "p": "brc-20",\n' +
        '  "op": "deploy",\n' +
        '  "tick": "",\n' +
        '  "max": "",\n' +
        '  "lim": ""\n' +
        "}";
      data = JSON.parse(data);
      data.tick = e.target.ticker.value;
      data.max = e.target.supply.value;
      data.lim = e.target.limit.value;

      console.log(data);
      //axios post  https://btchex.v1testmoseiki.online/ data
      const res = await axios.post(
        "https://btchex.v1testmoseiki.online/deploy",
        data
      );
      console.log(res);
      console.log(res.data);
      let txHash = res?.data?.txid;
      ToastSuccess({
        tHashLink: txHash,
      }).fire({
        title: "Transaction Successful",
      });
      setTxHash(txHash);
    } catch (error: any) {
      console.log(error);
      ToastError.fire({
        title: error?.message || "Something went wrong",
      });
    }
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="input-box">
        <div className="input-box_head">
          <div className="input-box_label">Receiving address (taproot)</div>
        </div>
        <div className="input-box_wrap">
          <input
            disabled
            value={
              address
            }
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
          className="bg-white px-6 py-3 w-2/3 flex text-black rounded-lg text-center justify-center hover:bg-gray-700 hover:text-white transition-colors border border-black hover:border-white text-xl"
        >
          Inscribe
        </button>
      </div>
      {txHash}
    </form>
  );
}
