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
export default function useOkx({
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
  const [chain, setChain]: any = useState(ChainData);

  useEffect(() => {
    if (window.ethereum && typeof window !== "undefined") {
      const getChainId = async () => {
        const { ethereum } = Ethers();
        const chainIdMetamask = await ethereum?.request({
          method: "eth_chainId",
        });
        //dispatch(setChainId(chainId));
        //console.log("chainIdMetamask", chainIdMetamask);
        const chainId = localStorage.getItem("chainId");
        //console.log("chainId123123", chainIdMetamask);

        if (chainIdMetamask.toString() !== chainId && !modal) {
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
            dispatch(setChainId(chainId));
          } else {
            dispatch(setClear());
            //localStorage.clear();
          }
          router.push("/buy-badge");
        });
      } catch (err) {
        console.error(err);
      }
    }
  });

  const CheckChain = (id: string) => {
    if (
      (id.toString() !== chainId && address) ||
      (id.toString() !== chainId && !["0x38", "0x5dd"].includes(id))
    ) {
      //dispatch(setClear());
      /* console.log("chainId", chainId);
      console.log("chain", chain[chainId]); */
      const okxwallet = (window as any).okxwallet;
      console.log("wallet connect");
      okxwallet.request({ method: "eth_requestAccounts" });

      const { name } = chain[id] || { name: "UNKNOW" };
      const fromNetwork = name || "Unknown Network";
      const toNetwork = chain[chainId]?.name || "Binance Smart Chain 2";

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
            try {
              //const chainId = await window.ethereum.request({ method: "eth_chainId" });
              //console.log("chainId1", chainId);
              //@ts-ignore
              (await ethereum?.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: chainId }],
              })) ||
                (await okxwallet.request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId: chainId }],
                }));
            } catch (switchError: any) {
              //console.log(switchError.code);

              // This error code indicates that the chain has not been added to OKX.
              if (switchError.code === 4902) {
                try {
                  await okxwallet.request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainId: chain[chainId].chainId,
                        chainName: chain[chainId].name,
                        nativeCurrency: {
                          name: chain[chainId].nativeCurrency.name,
                          symbol: chain[chainId].nativeCurrency.symbol,
                          decimals:
                            chain[chainId].nativeCurrency.decimals || 18,
                        },
                        rpcUrls: chain[chainId].rpcUrls,
                        blockExplorerUrls: chain[chainId].blockExplorerUrls,
                      },
                    ],
                  });
                } catch (error) {
                  console.log(error);
                }
              }
            }
          }
        });
      alert();
    }
    if (id.toString() === chainId) {
      ToastSuccess({}).fire({
        title: "Network Changed",
      });
      router.reload();
    }
  };
  //console.log("chainId", chainId);

  async function connecWallet() {
    try {
      const okxwallet = (window as any).okxwallet;
      console.log("wallet connect");
      let accounts = await okxwallet.request({ method: "eth_requestAccounts" });
      //console.log("accounts1", accounts);
      let address = accounts[0];

      localStorage.setItem("address", address);
      console.log("chainId", chainId);
      //@ts-ignore
      Close();
      dispatch(setAddress(address));
      await singMsg();
      ToastSuccess({}).fire({
        title: "Your wallet is connected successfully.",
      });
      console.log("status", ethers.utils.formatEther(chainId));
      //dispatch(setChainId(chainId));
      const chainIdNow = await window.ethereum.request({
        method: "eth_chainId",
      });
      if (chainId.toString() !== chainIdNow.toString()) {
        try {
          //console.log("chainId1", chainId);
          //@ts-ignore
          (await ethereum?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainId }],
          })) ||
            (await okxwallet.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: chainId }],
            }));
        } catch (switchError: any) {
          //console.log(switchError.code);

          // This error code indicates that the chain has not been added to OKX.
          if (switchError.code === 4902) {
            try {
              await okxwallet.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: chain[chainId].chainId,
                    chainName: chain[chainId].name,
                    nativeCurrency: {
                      name: chain[chainId].nativeCurrency.name,
                      symbol: chain[chainId].nativeCurrency.symbol,
                      decimals: chain[chainId].nativeCurrency.decimals || 18,
                    },
                    rpcUrls: chain[chainId].rpcUrls,
                    blockExplorerUrls: chain[chainId].blockExplorerUrls,
                  },
                ],
              });
            } catch (error) {
              console.log(error);
            }
          }
        }
      }

      //router.push("/my-account");
    } catch (error) {
      console.log(error);
    }
  }

  return { CheckChain, connecWallet };
}

async function singMsg(setSignature?: Function) {
  try {
    const { ethereum } = window as any;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider?.getSigner();
    let signature = await signer.signMessage("Connect To SoulBound :");
    //console.log(signature);
    //setSignature(signature);
  } catch (error) {
    console.log(error);
  }
}
