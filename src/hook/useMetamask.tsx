import Ethers from "@/lib/ethers";
import {
  selectData,
  setAddress,
  setChainId,
  setClear,
} from "@/redux/auth/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./redux/hooks";
import ChainData from "@/data/chain.json";
import Swal from "sweetalert2";
import { ToastSuccess } from "@/components/alert/SweatAlert";
import { ethers } from "ethers";
import ChainObject from "@/data/chainObject.json";
export default function useMetamask({
  modal,
  Close,
  address,
  chainId,
}: {
  modal?: boolean;
  Close: Function;
  address?: string;
  chainId?: any;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { chain:ChainPath } = router.query;
  console.log("chain", ChainPath);
  const [chainObject,setChainObject] :any= useState(ChainObject)
  const [chain, setChain]: any = useState(ChainData);
  useEffect(() => {
    // ismobil not working
    if (window.ethereum && typeof window !== "undefined" && !modal && window.innerWidth > 768) {
      const getChainId = async () => {
        const { ethereum } = Ethers();
        const chainIdMetamask = await ethereum?.request({
          method: "eth_chainId",
        });
        //dispatch(setChainId(chainId));
        //console.log("chainIdMetamask", chainIdMetamask);
        const chainId = localStorage.getItem("chainId");
        console.log("chainId123123", chainIdMetamask,chainId);

        if (chainIdMetamask.toString() !== chainId && !modal && ChainPath) {
          CheckChain(chainIdMetamask);
        }
        
      };
      getChainId();
      try {
        //@ts-ignore
        window.ethereum?.on("accountsChanged", (accounts) => {
          localStorage.clear();
          dispatch(setClear());
          router.push("/buy-badge");
          //router.reload();
        });
        //@ts-ignore
        window.ethereum?.on("chainChanged", (chainId) => {
          CheckChain(chainId);
          if (!address) {
            //dispatch(setChainId(chainId));

          } else {
            dispatch(setClear());
            //localStorage.clear();
          }
          router.push("/buy-badge");
          router.reload();
        });
      } catch (err) {
        console.error(err);
      }
    }
  });

  const CheckChain = (id: string) => {
    console.log("id", id,ChainPath, chainObject[ChainPath as string],chainId);
    
    const chainID = chainObject[ChainPath as string] || chainId;
    if (
      (id.toString() !== chainId && address) ||
      (id.toString() !== chainId && !["0x38", "0x5dd", "0x89"].includes(id))
    ) {
      //dispatch(setClear());
      /* console.log("chainId", chainId);
      console.log("chain", chain[chainId]); */
      const { name } = chain[id] || { name: "UNKNOW" };
      const fromNetwork = name || "Unknown Network";
      const toNetwork =  chain[chainID]?.name || "Binance Smart Chain 2";

      const alert = async () =>
        await Swal.fire({
          title: "Please Change Network",
          text: `From ${fromNetwork} to ${toNetwork}`,
          icon: "warning",
          iconColor: "#fff",
          showCancelButton: false,
          backdrop: true,
          background: "#191919",
          confirmButtonColor: "#282828",
          color: "#fff",
          confirmButtonText: "Yes, Change It!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            window.ethereum?.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: chain[chainID].chainId }],
            }) ||
              window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: chain[chainID].chainId,
                    chainName: chain[chainID].name,
                    nativeCurrency: {
                      name: chain[chainID].nativeCurrency.name,
                      symbol: chain[chainID].nativeCurrency.symbol,
                      decimals: 18,
                    },
                    rpcUrls: chain[chainID].rpcUrls,
                    blockExplorerUrls: chain[chainID].blockExplorerUrls,
                  },
                ],
              });
          }
        });
      alert();
    }
    console.log("id", id,chainID);
    
    if (id.toString() === chainID) {
      ToastSuccess({}).fire({
        title: "Network Changed",
      });
      router.reload();
    }
  };
  //console.log("chainId", chainId);

  async function connecWallet() {
    try {
      const { provider, ethereum } = Ethers();

      await ethereum.send("eth_requestAccounts");

      let chainIdNow = await window.ethereum.request({ method: "eth_chainId" });

      const signer = await provider?.getSigner();

      let signature = await signer.signMessage("Connect To SoulBound :");

      const [address /* , chainIdNow, networkName */] = await Promise.all([
        signer.getAddress(),
        signer.provider
          .getNetwork()
          .then((network: { chainId: any }) => network.chainId),
        signer.provider
          .getNetwork()
          .then((network: { name: any }) => network.name),
      ]);
      console.log("address", address);
      localStorage.setItem("address", address);

      console.log("chainId", chainId);
      //@ts-ignore
      Close();
      dispatch(setAddress(address));
      ToastSuccess({}).fire({
        title: "Your wallet is connected successfully.",
      });
      console.log("status", ethers.utils.formatEther(chainId));
      //dispatch(setChainId(chainId));
      if (
        chainId.toString() !== ethers.utils.formatEther(chainIdNow).toString()
      ) {
        ethereum?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chain[chainId].chainId }],
        }) ||
          ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chain[chainId].chainId,
                chainName: chain[chainId].name,
                nativeCurrency: {
                  name: chain[chainId].nativeCurrency.name,
                  symbol: chain[chainId].nativeCurrency.symbol,
                  decimals: 18,
                },
                rpcUrls: chain[chainId].rpcUrls,
                blockExplorerUrls: chain[chainId].blockExplorerUrls,
              },
            ],
          });
      }
      CheckChain(chainIdNow);
      //router.push("/my-account");
    } catch (error) {
      console.log(error);
    }
  }

  return { CheckChain, connecWallet };
}
