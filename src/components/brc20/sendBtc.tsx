import { ToastError, ToastSuccess } from "./alert/SweatAlert";

export default async function sendBtc(toAddress:string, satoshis:number, setTxid?:React.Dispatch<React.SetStateAction<string>>) {
    try {
      const txid = await (window as any).unisat.sendBitcoin(
        toAddress,
        satoshis
      );
      ToastSuccess({
        tHashLink: txid,
      }).fire({
        title: "Transaction Successful",
      });
      //setTxid(txid);
      
    } catch (e) {
      //setTxid((e as any).message);
      ToastError.fire({
        title: (e as any).message || "Something went wrong",
      });
    }
  }