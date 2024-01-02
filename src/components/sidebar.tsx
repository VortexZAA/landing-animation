import Link from "next/link";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import { ethers } from "ethers";
import Ethers from "@/lib/ethers";
import CopyBtn from "./button/copyBtn";
import {
  callGetNFT,
  callGetNFTInfo,
  parseIntHex,
} from "@/contractInteractions/useAppContract";
import { ToastError, ToastSuccess } from "./alert/SweatAlert";
import { useAppDispatch, useAppSelector } from "@/hook/redux/hooks";
import {
  setNftInfo,
  setVipLvl,
  setEmty,
  setClear,
  selectData,
  setAddress,
  setLoading,
  setnftId,
  setDownlines,
  setReferralIncome,
  setLvl,
  setLowPotentiel,
  setChainId,
} from "@/redux/auth/auth";
import Image from "next/image";
import CloseBtn from "./icons/close";
import { bigetConnect, bigetSwitch } from "@/lib/biget";
import Modal from "./Modal";
import ChainData from "@/data/chain.json";
import Swal from "sweetalert2";

export default function SideBar() {
  const [selected, setSelected]: any = useState(1);
  const router = useRouter();
  const [alert, setAlert] = useState<any>(null);

  const [isOpen, setIsOpen] = useState(false);
  const reduxData = useAppSelector(selectData);
  const { address, isEmty, chainId } = reduxData;
  const dispatch = useAppDispatch();
  function Close() {
    setIsOpen(false);
  }

  useEffect(() => {
    const local = localStorage.getItem("address");
    if (local && local !== address) {
      dispatch(setAddress(local));
    }
    const LocalIsEmty = localStorage.getItem("isEmty");
    if (LocalIsEmty) {
      const parsed = LocalIsEmty && JSON.parse(LocalIsEmty);
      dispatch(setEmty(parsed.isEmty));
    }
  }, [address]);

  useEffect(() => {
    dispatch(setLoading(false));
    getID(address);
  }, [address]);

  useEffect(() => {
    if (window.ethereum && typeof window !== "undefined") {
      try {
        //@ts-ignore
        window.ethereum?.on("accountsChanged", (accounts) => {
          localStorage.clear();
          dispatch(setClear());
          router.push("/buy-badge");
          router.reload();
        });
        //@ts-ignore
        window.ethereum?.on("chainChanged", (chainId) => {
          checkChain(chainId);
          localStorage.clear();
          dispatch(setClear());
          router.push("/buy-badge");
          router.reload();
        });
        checkIsAdmin();
      } catch (err) {
        console.error(err);
      }
    }
  });
  const [chain, setChain]: any = useState(ChainData);
  async function checkChain(chainId: string) {
    dispatch(setChainId(chainId));
    if (chainId.toString() !== chainId) {
      const { name } = chain[chainId] || { name: "UNKNOW" };
      const fromNetwork = name || "Unknown Network";
      const toNetwork = chain[chainId]?.name || "Binance Smart Chain2";

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
      }).then((result) => {
        if (result.isConfirmed) {
          window.ethereum?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chain[chainId].chainId }],
          }) ||
            window.ethereum.request({
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
      });
    }
    if (chainId.toString() === chainId) {
      ToastSuccess({}).fire({
        title: "Network Changed",
      });
      router.reload();
    }
  }
  async function checkIsAdmin() {
    if (address === process.env.NEXT_PUBLIC_ADMIN_ADDRESS) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      if (router.pathname === "/admin") {
        router.push("/my-account");
      }
    }
  }
  async function getID(address: string) {
    try {
      //let address = localStorage.getItem("address") || "";
      console.log("address", address);

      let id = await callGetNFT(address);
      console.log("id", id);

      //console.log("id", id);
      let emty = Number(id) === 0;
      console.log("emty", emty);

      localStorage.setItem("isEmty", JSON.stringify({ isEmty: emty }));
      dispatch(setEmty(emty));
      let authPath = ["/my-account", "/dashboard"];
      if (authPath.includes(router.pathname)) {
        emty && router.push("/buy-badge");
      } else if (router.pathname === "/buy-badge") {
        !emty && router.push("/my-account");
      }
      console.log("id", id, address);

      if (!emty) {
        //claimlimit-usedclaimlimit = withdrawable balance
        //console.log(parseIntHex(id[0]));
        let ID = Number(id);
        let getNFTInfo = await callGetNFTInfo(ID);
        console.log("ID", ID);
        dispatch(setnftId(ID));
        console.log("getNFTInfo", getNFTInfo);
        localStorage.setItem(
          "vipLvl",
          JSON.stringify(parseIntHex(getNFTInfo[0]))
        );
        dispatch(setVipLvl(parseIntHex(getNFTInfo[0])));
        let data = {
          vipLvl: parseIntHex(getNFTInfo[0]),
          id: parseIntHex(getNFTInfo[1]),
          holder: getNFTInfo[2],
          parent: parseIntHex(getNFTInfo[3]),
          leftPotentielChild: 0,//ethers.utils.formatEther(getNFTInfo[6]),
          rightPotentielChild: 0,//ethers.utils.formatEther(getNFTInfo[7]),
          referralIncome: ethers.utils.formatEther(getNFTInfo[4]),
          counter: parseIntHex(getNFTInfo[5]),
        };

        let lowPotentiel =
          Number(data.leftPotentielChild) < Number(data.rightPotentielChild)
            ? Number(data.leftPotentielChild)
            : Number(data.rightPotentielChild);
        console.log(
          "lowPotentiel",
          lowPotentiel,
          Number(data.rightPotentielChild),
          Number(data.leftPotentielChild)
        );
        dispatch(setLowPotentiel(lowPotentiel));

        const calculateLevel = (lowPotentiel: number) => {
          for (let i = 0; i < 8; i++) {
            if (lowPotentiel < 40000 * Math.pow(2, i)) {
              return i + 1;
            }
          }
          return 1;
        };
        let lvl = calculateLevel(lowPotentiel);

        dispatch(setDownlines(data.counter));
        dispatch(setLvl(lvl));
        dispatch(setReferralIncome(Number(data.referralIncome)));
        console.log(data);
        // let revenue = await callCalculateChildRevenue(ID);
        //console.log(revenue);
        let childData: any = {
          leftChildRevenue: 0,
          rightChildRevenue: 0,
        };
        /* if (revenue) {
          childData = {
            leftChildRevenue: ethers.utils.formatEther(revenue[0]),
            rightChildRevenue: ethers.utils.formatEther(revenue[1]),
          };
          //console.log("childData", childData);

          const totalRevenue =
            Number(childData.leftChildRevenue) +
            Number(childData.rightChildRevenue);
          localStorage.setItem("totalRevenue", JSON.stringify(totalRevenue));
          dispatch(setTotalRevenue(totalRevenue));
          let lowRevenue =
            Number(childData.leftChildRevenue) / totalRevenue > 0.5
              ? Number(childData.rightChildRevenue) * 0.1
              : Number(childData.leftChildRevenue) * 0.1;

          //console.log("lowRevenue", lowRevenue);

          const withdrawableBalance = lowRevenue;
          //console.log("withdrawableBalance", withdrawableBalance);

          localStorage.setItem(
            "withdrawableBalance",
            JSON.stringify(withdrawableBalance)
          );
          dispatch(setWithdrawableBalance(withdrawableBalance));
        } */
        //console.log(childData);
        const datas: any = {
          id: data.id.toString(),
          name: "a",
          address: data.holder,
          leftChildRevenue: childData?.leftChildRevenue,
          rightChildRevenue: childData?.rightChildRevenue,
          //vipLvl: data.vipLvl,
          parent: data.parent.toString(),
          count:data.counter,
          children: [
            /* {
              id: data.leftChild,
              name: "b",
              parent: data.id.toString(),
              children: [],
            },
            {
              id: data.rightChild,
              name: "c",
              parent: data.id.toString(),
              children: [],
            }, */
          ],
        };

        console.log(datas);
        datas.children = datas.children.filter((item: any) => item.id !== 0);
        localStorage.setItem("nftInfo", JSON.stringify([datas]));
        dispatch(setNftInfo([datas]));
      }
    } catch (error) {
      console.log(error);
      /* ToastError.fire({
        title: "Something went wrong.",
      }); */
    }
  }
  const [isAdmin, setIsAdmin] = useState(false);

  async function connecWallet() {
    try {
      const { provider, ethereum } = Ethers();

      await ethereum.send("eth_requestAccounts");
      // connect to just metamask

      //const signer = await provider?.getSigner();

      const signer = await provider?.getSigner();
      const [address, chainId, networkName] = await Promise.all([
        signer.getAddress(),
        signer.provider
          .getNetwork()
          .then((network: { chainId: any }) => network.chainId),
        signer.provider
          .getNetwork()
          .then((network: { name: any }) => network.name),
      ]);

      checkIsAdmin();

      console.log("address", address);
      localStorage.setItem("address", address);
      console.log("chainId", chainId);
      //@ts-ignore
      dispatch(setAddress(address));
      setIsOpen(false);
      ToastSuccess({}).fire({
        title: "Your wallet is connected successfully.",
      });
      console.log("status", ethers.utils.formatEther(chainId));
      //dispatch(setChainId(chainId));
      if (
        chainId.toString() !==
        ethers.utils.formatEther(chainId).toString()
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
      //console.log("hexlify", ethers.utils.hexlify(selectedChain));

      router.push("/my-account");
    } catch (error) {
      console.log(error);
    }
  }
  const menu = [
    {
      id: 2,
      name: "My Account",
      path: "/my-account",
      icon: (
        <svg
          width="16"
          height="20"
          viewBox="0 0 16 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5 12C2.23858 12 0 14.2386 0 17C0 18.6569 1.34315 20 3 20H13C14.6569 20 16 18.6569 16 17C16 14.2386 13.7614 12 11 12H5Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 0C5.23858 0 3 2.23858 3 5C3 7.76142 5.23858 10 8 10C10.7614 10 13 7.76142 13 5C13 2.23858 10.7614 0 8 0Z"
            fill="currentColor"
          />
        </svg>
      ),
      status: true, // !isEmty,
    },
    {
      id: 3,
      name: "Buy Badge ",
      path: "/buy-badge",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.45925 6C4.02505 6 2.1552 8.15595 2.49945 10.5657L3.51965 17.7071C3.87155 20.1704 5.98115 22 8.4694 22H15.531C18.0193 22 20.1289 20.1704 20.4808 17.7071L21.501 10.5657C21.8452 8.15595 19.9754 6 17.5412 6H6.45925Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.00013 4.76363C7.84713 3.06962 9.57835 2 11.4721 2H12.5279C14.4217 2 16.1531 3.07003 17 4.76396L17.8944 6.55279C18.1414 7.04677 17.9412 7.64744 17.4472 7.89443C16.9532 8.14142 16.3525 7.94119 16.1055 7.44721L15.2111 5.65838C14.703 4.64202 13.6642 4 12.5279 4H11.4721C10.3357 4 9.29711 4.64179 8.78898 5.65805L7.8944 7.44721C7.64741 7.94119 7.04674 8.14142 6.55276 7.89443C6.05878 7.64744 5.85856 7.04676 6.10555 6.55279L7.00013 4.76363Z"
            fill="currentColor"
          />
        </svg>
      ),
      status: isEmty,
    },
    {
      id: 4,
      name: "Launchpad",
      path: "/launchpad",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          height="20"
          width="20"
          viewBox="0 0 512 512"
        >
          <path d="M156.6 384.9L125.7 354c-8.5-8.5-11.5-20.8-7.7-32.2c3-8.9 7-20.5 11.8-33.8L24 288c-8.6 0-16.6-4.6-20.9-12.1s-4.2-16.7 .2-24.1l52.5-88.5c13-21.9 36.5-35.3 61.9-35.3l82.3 0c2.4-4 4.8-7.7 7.2-11.3C289.1-4.1 411.1-8.1 483.9 5.3c11.6 2.1 20.6 11.2 22.8 22.8c13.4 72.9 9.3 194.8-111.4 276.7c-3.5 2.4-7.3 4.8-11.3 7.2v82.3c0 25.4-13.4 49-35.3 61.9l-88.5 52.5c-7.4 4.4-16.6 4.5-24.1 .2s-12.1-12.2-12.1-20.9V380.8c-14.1 4.9-26.4 8.9-35.7 11.9c-11.2 3.6-23.4 .5-31.8-7.8zM384 168a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
        </svg>
      ),
      status: true,
    },
    {
      id: 5,
      name: "NFT Marketplace",
      path: "/nft-marketplace",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.2499 17V19.75H7.7499V17C7.7499 16.311 8.3109 15.75 8.9999 15.75H10.9999C11.6889 15.75 12.2499 16.311 12.2499 17ZM15.9999 12.25C14.8999 12.25 13.8599 11.97 12.9999 11.46C12.1299 11.97 11.0899 12.25 9.9999 12.25C8.9099 12.25 7.8699 11.97 6.9999 11.46C6.1399 11.97 5.0999 12.25 3.9999 12.25C3.0099 12.25 2.0699 12.02 1.2499 11.6V17C1.2499 18.52 2.4799 19.75 3.9999 19.75H6.2499V17C6.2499 15.483 7.4829 14.25 8.9999 14.25H10.9999C12.5169 14.25 13.7499 15.483 13.7499 17V19.75H15.9999C17.5199 19.75 18.7499 18.52 18.7499 17V11.6C17.9299 12.02 16.9899 12.25 15.9999 12.25ZM7.3389 0.249993H4.4929C3.2839 0.249993 2.1999 1.05999 1.8559 2.21899L0.445902 6.97699C0.159902 7.94199 0.395902 8.95599 1.0619 9.62599C1.7729 10.34 2.8439 10.75 3.9999 10.75C4.6959 10.75 5.3299 10.592 5.8799 10.336L7.3389 0.249993ZM11.1459 0.249993H8.8539L7.4529 9.93899C8.1169 10.436 8.9969 10.75 9.9999 10.75C11.0029 10.75 11.8829 10.437 12.5469 9.93899L11.1459 0.249993ZM19.5539 6.97999L18.1429 2.21699C17.7999 1.05899 16.7159 0.248993 15.5069 0.248993H12.6609L14.1189 10.335C14.6699 10.591 15.3029 10.749 15.9989 10.749C17.1539 10.749 18.2249 10.339 18.9369 9.62499C19.6029 8.95599 19.8389 7.94299 19.5539 6.97999Z"
            fill="currentColor"
          />
        </svg>
      ),
      status: false,
    },
    {
      id: 6,
      name: "FAQ",
      path: "/faq",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          height="20"
          width="20"
          viewBox="0 0 512 512"
        >
          <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
        </svg>
      ),
      status: true,
    },
    {
      id: 7,
      name: "Airdrop",
      path: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          height="20"
          width="20"
          viewBox="0 0 512 512"
        >
          <path d="M96 320c-53 0-96-43-96-96c0-42.5 27.6-78.6 65.9-91.2C64.7 126.1 64 119.1 64 112C64 50.1 114.1 0 176 0c43.1 0 80.5 24.3 99.2 60c14.7-17.1 36.5-28 60.8-28c44.2 0 80 35.8 80 80c0 5.5-.6 10.8-1.6 16c.5 0 1.1 0 1.6 0c53 0 96 43 96 96s-43 96-96 96H96zm-6.8 52c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3v3c0 26.5-21.5 48-48 48s-48-21.5-48-48v-3c0-8.5 2.1-16.9 6.2-24.3L89.2 372zm160 0c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3v3c0 26.5-21.5 48-48 48s-48-21.5-48-48v-3c0-8.5 2.1-16.9 6.2-24.3L249.2 372zm124.9 64.6L409.2 372c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3v3c0 26.5-21.5 48-48 48s-48-21.5-48-48v-3c0-8.5 2.1-16.9 6.2-24.3z" />
        </svg>
      ),
      status: true,
      comingSoon: true,
    },
    {
      id: 8,
      name: "Bridge ",
      path: "https://bswap.bevm.io/#/bridge",
      target: "_blank",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          height="20"
          width="18"
          viewBox="0 0 576 512"
        >
          <path d="M32 32C14.3 32 0 46.3 0 64S14.3 96 32 96H72v64H0V288c53 0 96 43 96 96v64c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V384c0-53 43-96 96-96s96 43 96 96v64c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V384c0-53 43-96 96-96V160H504V96h40c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM456 96v64H376V96h80zM328 96v64H248V96h80zM200 96v64H120V96h80z" />
        </svg>
      ),
      status: true,
    },
    {
      id: 9,
      name: "Stake ",
      path: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          height="20"
          width="20"
          viewBox="0 0 512 512"
        >
          <path d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2l0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5V176c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336V300.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4V304v5.7V336zm32 0V304 278.1c19-4.2 36.5-9.5 52.1-16c16.3-6.8 31.5-15.2 43.9-25.5V272c0 10.5-5 21-14.9 30.9c-16.3 16.3-45 29.7-81.3 38.4c.1-1.7 .2-3.5 .2-5.3zM192 448c56.2 0 108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5V432c0 44.2-86 80-192 80S0 476.2 0 432V396.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448z" />
        </svg>
      ),
      status: true,
      comingSoon: true,
    },
  ];
  async function BigetConnect() {
    try {
      await bigetConnect();
      await bigetSwitch(chainId);

      /*  */
    } catch (error) {
      console.log(error);
    }
  }
  const [modal, setModal] = useState(false);
  //const [selectedChain, setSelectedChain] = useState<string>("0x5dd"); //<"0x5dd" | "0x38">("0x38");
  useEffect(() => {
    chainId && localStorage.setItem("chainId", chainId);
    //setSelectedChain(chainId);
  }, [chainId]);
  useEffect(() => {
    const localChainId = localStorage.getItem("chainId") || "0x5dd";
   // setSelectedChain(localChainId);
    dispatch(setChainId(localChainId));
  }, []);
console.log("chainId",chainId);

  return (
    <>
      <nav className=" flex flex-col backdrop-blur-sm bg-white/10 w-fit xl:w-64 shrink-0 border-solid h-screen top-0  justify-between items-center text-white px-3 md:px-4 pb-6 md:pb-10 pt-3 md:pt-6 gap-3 md:gap-6 transition-  text-sm fixed z-50">
        <Link href={"/"} className="w-full md:-ml-0">
          <Image
            src={"/logo.png"}
            width={500}
            height={500}
            className="w-12 h-fit xl:w-20"
            alt="logo"
          />
        </Link>
        <ul className="w-full h-full">
          {menu.map(
            (item) =>
              item.status && (
                <li
                  key={item.id}
                  onClick={() => setSelected(item.id)}
                  className={`mb-4 flex flex-col gap-3 group items-center cursor-pointer w-full rounded-md transition-colors hover:bg-gray-200 hover:text-gray-700 relative  ${
                    router.pathname === item.path &&
                    "!bg-btnActive text-white hover:text-white "
                  }`}
                >
                  <Link
                    target={item.target || "_self"}
                    className="flex justify-center items-center xl:justify-start gap-3 h-full w-full p-3"
                    href={item.path}
                  >
                    {item.icon}

                    {item.comingSoon ? (
                      <>
                        <span className="animate-fadeIn text-orange-600 font-medium group-hover:flex hidden">
                          Coming Soon
                        </span>
                        <span className="  hidden xl:block group-hover:hidden">
                          {item.name}
                        </span>
                      </>
                    ) : (
                      <span className=" hidden xl:block">{item.name}</span>
                    )}
                  </Link>
                </li>
              )
          )}
          {isAdmin && (
            <li
              onClick={() => setSelected("admin")}
              className={`mb-4 flex gap-3 cursor-pointer w-full rounded-md transition-colors hover:bg-gray-200 hover:text-gray-700  ${
                router.pathname === "/admin" &&
                "!bg-btnActive text-white hover:text-white "
              }`}
            >
              <Link
                className="flex justify-center items-center xl:justify-start gap-3 h-full w-full p-3"
                href={"/admin"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-fit"
                  fill="currentColor"
                  viewBox="0 0 448 512"
                >
                  <path d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7H162.5c0 0 0 0 .1 0H168 280h5.5c0 0 0 0 .1 0H417.3c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2H224 204.3c-12.4 0-20.1 13.6-13.7 24.2z" />
                </svg>
                <span className=" hidden xl:block"> Admin</span>
              </Link>
            </li>
          )}
        </ul>
        {isOpen && (
          <div className="bg-white text-black rounded-lg  pb-6 pt-3 w-60 absolute bottom-36 left-6 border flex flex-col font-bold text-base ">
            <div className="flex w-full justify-between px-3">
              <span>Connect Wallet</span>
              <button type="button" onClick={Close}>
                <CloseBtn />
              </button>
            </div>
            <div className="flex flex-col gap-3 mt-3 px-6 text-black">
              <button
                onClick={() => {
                  setModal(true);
                  //setSelectedChain("0x38");
                  dispatch(setChainId("0x38"));
                }}
                className="w-full hidden h-12 p-3 border-2  justify-start items-center transition-colors text-xs gap-2 rounded-md"
              >
                <img src="/bnb.svg" alt="" className="h-full" />
                BNB Chain
              </button>
              <button
                onClick={() => {
                  setModal(true);
                  //setSelectedChain("0x5dd");
                  dispatch(setChainId("0x5dd"));
                }}
                className="w-full h-12 p-3 border-2 flex justify-start items-center transition-colors text-xs gap-2 rounded-md"
              >
                <img src="/bevm.svg" alt="" className="h-full" />
                Chain
              </button>
              <button
                onClick={() => {
                  setModal(true);
                  //setSelectedChain("0x58f8");
                  dispatch(setChainId("0x58f8"));
                }}
                className="w-full h-12 p-3 border-2 flex justify-start items-center transition-colors text-xs gap-2 rounded-md"
              >
                <img src="/mapo.png" alt="" className="h-full" />
                Map Chain
              </button>
            </div>
          </div>
        )}
        {address ? (
          <div className="text-center border-4 border-purple w-full shrink-0  rounded-lg py-2 px-2 xl:px-4 text-xs flex gap-2 items-center ">
            <img src="/metamask2.svg" className="h-6" alt="" />
            <span className="hidden xl:block">
              {address &&
                address.slice(0, 7) +
                  "....." +
                  address.slice(address.length - 7, address.length)}
            </span>
            <span className="hidden xl:block">
              <CopyBtn text={address} />
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-fit xl:w-full p-3 h-12 bg-purple hover:bg-purple/90 transition-colors text-white rounded-md xl:mx-6"
          >
            <span className="hidden xl:block">Connect Wallet</span>
            <span className="block xl:hidden h-6 w-6 text-white">
              <Image src={"/wallet.svg"} width={500} height={500} alt="" />
            </span>
          </button>
        )}
        {address && (
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("address");
              localStorage.removeItem("isEmty");
              localStorage.clear();
              dispatch(setClear());
              router.push("/buy-badge");
            }}
            className="w-fit xl:w-full p-3 -mt-3 h-12 bg-red-500 hover:bg-500/90 transition-colors text-white rounded-md xl:mx-6"
          >
            <span className="hidden xl:block" >Disconnect</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className=" block xl:hidden h-full w-fit" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg>
          </button>
        )}
      </nav>
      <Modal
        title="Select Wallet"
        modal={address ? false : modal}
        setModal={setModal}
      >
        <div className="grid grid-cols-2 gap-3  px-6 text-black  font-bold p-6 bg-white">
          <button
            onClick={connecWallet}
            className="w-full h-12 p-3 border-2 flex justify-start items-center transition-colors text-xs gap-2 rounded-md"
          >
            <img src="/metamask2.svg" alt="" className="h-2/3" />
            Metamask Wallet
          </button>
          <button
            onClick={connecWallet}
            className="w-full h-12 p-3 border-2 flex justify-start items-center transition-colors text-xs gap-2 rounded-md"
          >
            <img src="/okx.svg" alt="" className="h-full" />
            OKX Wallet
          </button>
          <button
            onClick={connecWallet}
            className="w-full h-12 p-3 border-2 flex justify-start items-center transition-colors text-xs gap-2 rounded-md"
          >
            <img src="/tokenpocket.png" alt="" className="h-full" />
            TokenPocket Wallet
          </button>
          <button
            onClick={BigetConnect}
            className="w-full h-12 p-3 border-2 flex justify-start items-center transition-colors text-xs gap-2 rounded-md"
          >
            <img src="/bitget.svg" alt="" className="h-full" />
            Bitget Wallet
          </button>
        </div>
      </Modal>
    </>
  );
}
