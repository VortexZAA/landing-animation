import { ToastError, ToastSuccess } from "@/components/alert/SweatAlert";
import {
  callHasMinted,
  callMint,
  callRegister,
  callTokenURI,
  importToMetamask,
} from "@/contractInteractions/useAppContract";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function OKX() {
  const ChainID: string = "0x5de";
  const [address, setAddress] = useState("");
  //okx wallet connect function

  useEffect(() => {
    async () => {
      const { ethereum } = window as any;
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      console.log("chainId1", chainId);
    };
    //@ts-ignore
    okxwallet.on("accountsChanged", (accounts: Array<string>) => {
      //console.log("accounts2", accounts);
      setAddress(accounts[0]);
    });
    //@ts-ignore
    okxwallet.on("chainChanged", (chainId: number) => {
      console.log("chainId2", chainId);
    });
  });

  const [signature, setSignature] = useState("");

  return (
    <main
      className={`flex min-h-[100dvh] w-screen max-w-[100vw] overflow-x-hidden gap-6  items-start p-6 justify-between z-20 relative wrap`}
    >
      <div className=" text-white flex flex-col gap-3 w-full">
        <div className="flex flex-col md:flex-row md:justify-between gap-3  container mx-auto w-full">
          <h2 className="text-white text-3xl z-20">OKX</h2>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                walletConnect({
                  ChainID,
                  address,
                  setAddress,
                });
                singMsg(setSignature);
              }}
              className="bg-white text-black px-4 py-2 rounded-md"
            >
              Connect
            </button>
            address: {address}
          </div>
          {address && (
            <button
              onClick={async () => await ghostMint(address)}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Ghost Mint
            </button>
          )}
          <div className="w-full text-xs">signature: {signature}</div>
        </div>
        {address && (
          <button
            onClick={() => Mint(address)}
            className="bg-white text-black px-4 py-2 rounded-md"
          >
            Buy NFT
          </button>
        )}
      </div>
    </main>
  );
}
async function Mint(address: string) {
  try {
    // random number 1-2
    const rndNumber = Math.floor(Math.random() * 2);
    const tempInput1 =
      "74982427027333804747598896291494624256205312693838949856412064819153210319537"; //uInput1 || childRef[rndNumber];
    const tx: any = await callRegister(tempInput1, 1, address);
    tx &&
      ToastSuccess({
        tHashLink: tx.hash,
      }).fire({
        title: "Transaction Successful",
      });
    //router.push("/dashboard");

    //dispatch(setLoading(false));
  } catch (error) {
    console.log(error);
    ToastError.fire({
      title: "Transaction Failed",
    });
    //dispatch(setLoading(false));
  }
}
async function ghostMint(address: string) {
  const [modalHelsinki, setModalHelsinki] = useState(false);
  try {
    let id = await callMint(address);
    let uri = await callTokenURI(id);
    let res = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
    let data = await res.json();
    importToMetamask(
      id,
      data.image.replace("ipfs://", "https://ipfs.io/ipfs/")
    );
    //alert("You found the wizard, so your prize is " + id);
    setModalHelsinki(false);
    //dispatch(setLoading(false));
  } catch (error) {
    //dispatch(setLoading(false));
    //console.error("Error minting:", error);
    ToastError.fire({
      title: "Something went wrong.",
    });
  }
}
async function singMsg(setSignature: Function) {
  try {
    const { ethereum } = window as any;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider?.getSigner();
    let signature = await signer.signMessage("Connect To SoulBound :");
    //console.log(signature);
    setSignature(signature);
  } catch (error) {
    console.log(error);
  }
}

const walletConnect = async ({
  ChainID,
  address,
  setAddress,
}: {
  ChainID: string;
  address: string;
  setAddress: Function;
}) => {
  const okxwallet = (window as any).okxwallet;
  console.log("wallet connect");
  okxwallet.request({ method: "eth_requestAccounts" });
  let accounts = await okxwallet.request({ method: "eth_requestAccounts" });
  //console.log("accounts1", accounts);
  setAddress(accounts[0]);
  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    //console.log("chainId1", chainId);
    //@ts-ignore
    (await ethereum?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ChainID }],
    })) ||
      (await okxwallet.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ChainID }],
      }));
  } catch (switchError: any) {
    //console.log(switchError.code);

    // This error code indicates that the chain has not been added to OKX.
    if (switchError.code === 4902) {
      try {
        await okxwallet.request({
          method: "wallet_addEthereumChain",
          params: [
            ChainID === "0x5de"
              ? {
                  chainId: "0x5de",
                  chainName: "BEVM Canary TestNet",
                  nativeCurrency: {
                    name: "Bitcoin",
                    symbol: "BTC",
                    decimals: 18,
                  },
                  rpcUrls: ["https://canary-testnet.bevm.io/"],
                  blockExplorerUrls: ["https://scan-canary-testnet.bevm.io/"],
                }
              : {
                  chainId: "0x5dd",
                  chainName: "BEVM Canary",
                  nativeCurrency: {
                    name: "Bitcoin",
                    symbol: "BTC",
                    decimals: 18,
                  },
                  rpcUrls: [
                    "https://rpc-canary-1.bevm.io",
                    "/https://rpc-canary-2.bevm.io/",
                  ],
                  blockExplorerUrls: ["hhttps://scan-canary.bevm.io/"],
                },
          ],
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
