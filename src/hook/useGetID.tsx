import {
  selectData,
  setDownlines,
  setEmty,
  setLowPotentiel,
  setLvl,
  setNftInfo,
  setReferralIncome,
  setVipLvl,
  setnftId,
} from "@/redux/auth/auth";
import { useAppSelector } from "./redux/hooks";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  callGetNFT,
  callGetNFTInfo,
  parseIntHex,
} from "@/contractInteractions/useAppContract";
import { ethers } from "ethers";

export default function useGetID() {
  const dispatch = useDispatch();
  const router = useRouter();
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
          leftPotentielChild: 0, //ethers.utils.formatEther(getNFTInfo[6]),
          rightPotentielChild: 0, //ethers.utils.formatEther(getNFTInfo[7]),
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

        const datas: any = {
          id: data.id.toString(),
          name: "a",
          address: data.holder,
          leftChildRevenue: childData?.leftChildRevenue,
          rightChildRevenue: childData?.rightChildRevenue,
          //vipLvl: data.vipLvl,
          parent: data.parent.toString(),
          count: data.counter,
          children: [],
        };

        console.log(datas);
      }
    } catch (error) {
      console.log(error);
      /* ToastError.fire({
            title: "Something went wrong.",
          }); */
    }
  }
  return { getID };
}
