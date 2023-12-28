import { ethers } from "ethers";
import {
  callNFTContract,
  callNFTContractBiget,
  callTokenContract,
} from "./etherumContracts";
import { ToastError } from "@/components/alert/SweatAlert";
import Ethers from "@/lib/ethers";

const marketContract = process.env.NEXT_PUBLIC_MARKETPLACE as string;
const tokenContract = process.env.NEXT_PUBLIC_TOKEN as string;
//NFT Functions

// NFT satın almak için kullanılan fonksiyon
export const callRegister = async (
  refferal: number,
  vipTier: number,
  minterAddres: string,
  etherAmount?: string
) => {
  try {
    const { contractWithSigner } = await callNFTContract();
    let priceOfTier1 = await contractWithSigner.getNFTPrice(1);
    let priceOfTier2 = await contractWithSigner.getNFTPrice(2);
    let priceOfTier3 = await contractWithSigner.getNFTPrice(3);
    const weiValue = vipTier=== 1 ? priceOfTier1 : vipTier=== 2 ? priceOfTier2 : priceOfTier3
    console.log("weiValue", weiValue);
    
    let tx = await contractWithSigner.register(
      [refferal, vipTier],
      minterAddres,
      { value: weiValue }
    );
    let receipt = await tx.wait();
    const txHash = tx.hash;
    // transaction receipt hash
    return { hash: txHash, res: receipt };
  } catch (error) {
    const err = error as any; // Type assertion

    console.error("Error during register:", err);

    // Check for user rejection
    if (err.code === "ACTION_REJECTED") {
      /* alert("Transaction was rejected by the user."); */
      ToastError.fire({
        title: "Transaction was rejected by the user.",
      });
    }
    // Check for revert reason: "You already have an NFT."
    else if (err.message && err.message.includes("You already have an NFT")) {
      /* alert("You have already registered an NFT."); */
      ToastError.fire({
        title: "You have already registered an NFT.",
      });
    } else if (
      err.message &&
      err.message.includes("Desired parent node is not empty")
    ) {
      /* alert("Desired parent node is not empty."); */
      ToastError.fire({
        title: "Desired parent node is not empty.",
      });
    }
    // Check for insufficient funds
    else if (err.message && err.message.includes("insufficient funds")) {
      /* alert("You do not have enough USDT in your account to mint."); */
      ToastError.fire({
        title: "You do not have enough USDT in your account to mint.",
      });
    }
    // Generic error message for other cases
    else {
      /* alert(
        "There was an error during the registering process. Please check your accounts balance and try again." 
      ); */
      ToastError.fire({
        title:
          "There was an error during the registering process. Please check your accounts balance and try again.",
      });
      console.log(err);
    }

    return false;
  }
};

// NFT'ye özel başklarının NFT almasında kullanıcı referans kodunu oluşturmak için kullanılan fonksiyon
export const callGetReferralCodeForLeft = async (user: string) => {
  try {
    const { contractWithSigner } = await callNFTContract();
    let NFTID = await contractWithSigner.getNFT(user);
    let refferal = await contractWithSigner.encodeIDForLeft(NFTID);
    return refferal;
  } catch (error) {
    console.error("Error during refferal:", error);
    /* alert("There was an error during the refferal process. Please try again."); */
    ToastError.fire({
      title:
        "There was an error during the refferal process. Please try again.",
    });
    return false;
  }
};

export const callGetReferralCodeForRight = async (user: string) => {
  try {
    const { contractWithSigner } = await callNFTContract();
    let NFTID = await contractWithSigner.getNFT(user);
    let refferal = await contractWithSigner.encodeIDForRight(NFTID);
    return refferal;
  } catch (error) {
    console.error("Error during refferal:", error);
    /* alert("There was an error during the refferal process. Please try again."); */
    ToastError.fire({
      title:
        "There was an error during the refferal process. Please try again.",
    });
    return false;
  }
};

// Biriken ödülü çekmek için kullanılan fonksiyon
export const callWithdraw = async () => {
  try {
    const { contractWithSigner } = await callNFTContract();
    let tx = await contractWithSigner.distributeRewards();
    let receipt = await tx.wait();
    let hash = tx.hash;
    return { hash: hash, res: receipt };
  } catch (err: any) {
    console.error("Error during withdraw:", err);

    if (
      err.message &&
      err.message.includes("Both children must exist to claim rewards")
    ) {
      /* alert("You have already registered an NFT."); */
      ToastError.fire({
        title: "Both children must exist to claim rewards.",
      });
    } else if (err.message.includes("You do not have any reward")) {
      /* alert("You have already registered an NFT."); */
      ToastError.fire({
        title: "You do not have any reward.",
      });
    } else if (
      err.message.includes("You exceeded your weekly withdraw limit!")
    ) {
      /* alert("You have already registered an NFT."); */
      ToastError.fire({
        title: "You exceeded your weekly withdraw limit!.",
      });
    } else if (err.message.includes("Claim exceeds available income")) {
      /* alert("You have already registered an NFT."); */
      ToastError.fire({
        title: "Claim exceeds available income.",
      });
    } else {
      /* alert("There was an error during the withdraw process. Please try again."); */
      ToastError.fire({
        title:
          "There was an error during the withdraw process. Please try again.",
      });
    }
    return false;
  }
};
// Biriken refferal ödülünü çekmek için kullanılan fonksiyon
export const claimReferralReward = async () => {
  try {
    const { contractWithSigner } = await callNFTContract();
    let tx = await contractWithSigner.claimReferralReward();
    let receipt = await tx.wait();
    let hash = tx.hash;
    return { hash: hash, res: receipt };
  } catch (error) {
    console.error("Error during claimReferralReward:", error);
    /* alert(
      "There was an error during the claimReferralReward process. Please try again."
    ); */
    ToastError.fire({
      title:
        "There was an error during the claimReferralReward process. Please try again.",
    });
    return false;
  }
};
// NFT VIP seviyesini arttırmak için kullanılan fonksiyon
export const callUpgrade = async (tier: number) => {
  try {
    const { contractWithSigner } = await callNFTContract();
    const weiValue =  tier === 1 ? process.env.NEXT_PUBLIC_TIER1 : tier === 2 ? process.env.NEXT_PUBLIC_TIER2 : process.env.NEXT_PUBLIC_TIER3
    console.log("weiValue", weiValue);
    
    let tx = await contractWithSigner.upgradeTier(tier,{ value: weiValue });
    let receipt = await tx.wait();
    let hash = tx.hash;
    return {
      hash: hash,
      res: receipt,
    };
  } catch (error) {
    console.error("Error during upgrade:", error);
    /* alert("There was an error during the upgrade process. Please try again."); */
    ToastError.fire({
      title: "There was an error during the upgrade process. Please try again.",
    });
    return false;
  }
};
//Read Functions

// VIP seviyesine göre fiyatı dönen fonksiyon
export const callGetPrice = async (tier: number) => {
  try {
    const { contractWithSigner } = await callNFTContract();
    let price = await contractWithSigner.getPrice(tier);
    return price;
  } catch (error) {
    console.error("Error during getPrice:", error);
    /* alert("There was an error during the getPrice process. Please try again."); */
    ToastError.fire({
      title:
        "There was an error during the getPrice process. Please try again.",
    });
    return false;
  }
};

// NFT ID'lerine göre bilgilerini dönen fonksiyon
export const callGetNFTInfos = async (tokenIds: number[]) => {
  try {
    const { contractWithSigner } = await callNFTContract();
    let NFTInfos = await contractWithSigner.getNFTInfos(tokenIds);
    return NFTInfos;
  } catch (error) {
    console.error("Error during getNFTInfos:", error);
    /* alert(
      "There was an error during the getNFTInfos process. Please try again."
    ); */
    ToastError.fire({
      title:
        "There was an error during the getNFTInfos process. Please try again.",
    });
    return false;
  }
};
// NFT ID'sine göre bilgilerini dönen fonksiyon
export const callGetNFTInfoBiget = async (ID: number) => {
  try {
    console.log("ID", ID);

    const { contractWithSigner } = await callNFTContractBiget();
    let NFTInfo = await contractWithSigner.getNFTInfo(ID);
    return NFTInfo;
  } catch (error) {
    console.error("Error during getNFTInfo:", error);
    /* alert(
      "There was an error during the getNFTInfo process. Please try again."
    ); */
    ToastError.fire({
      title:
        "There was an error during the getNFTInfo process. Please try again.",
    });
    return false;
  }
};
export const callGetNFTInfo = async (ID: number) => {
  try {
    console.log("ID", ID);

    const { contractWithSigner } = await callNFTContract();
    let NFTInfo = await contractWithSigner.getNFTInfo(ID);
    return NFTInfo;
  } catch (error) {
    console.error("Error during getNFTInfo:", error);
    /* alert(
      "There was an error during the getNFTInfo process. Please try again."
    ); */
    ToastError.fire({
      title:
        "There was an error during the getNFTInfo process. Please try again.",
    });
    return false;
  }
};
// Girilen adrese ait NFT ID'sini dönen fonksiyon
export const callGetNFT = async (holder: string) => {
  try {
    console.log("holder", holder);

    const { contractWithSigner } = await callNFTContract();
    let NFTId = await contractWithSigner.getNFT(holder);
    console.log("NFTId", NFTId);

    return NFTId;
  } catch (error) {
    console.error("Error during getNFT:", error);
    //alert("There was an error during the getNFT process. Please try again.");
    /* ToastError.fire({
      title: "There was an error during the getNFT process. Please try again.",
    }); */
    return false;
  }
};
export const callGetNFTBiget = async (holder: string) => {
  try {
    console.log("holder", holder);

    const { contractWithSigner } = await callNFTContractBiget();
    let NFTId = await contractWithSigner.getNFT(holder);
    console.log("NFTId", NFTId);

    return NFTId;
  } catch (error) {
    console.error("Error during getNFT:", error);
    //alert("There was an error during the getNFT process. Please try again.");
    /* ToastError.fire({
      title: "There was an error during the getNFT process. Please try again.",
    }); */
    return false;
  }
};
// Girilen ID'nin sahibi olan cüzdan adresini dönen fonksiyon
export const callGetHolder = async (tokenId: number) => {
  try {
    const { contractWithSigner } = await callNFTContract();
    let holder = await contractWithSigner.getHolder(tokenId);
    return holder;
  } catch (error) {
    console.error("Error during getHolder:", error);
    /* alert("There was an error during the getHolder process. Please try again."); */
    ToastError.fire({
      title:
        "There was an error during the getHolder process. Please try again.",
    });
    return false;
  }
};
//  Girilen ID'nin sağ ve sol bacağının revenue değerini dönen fonksiyon
export const callCalculateChildRevenue = async (_id: number) => {
  try {
    const { contractWithSigner } = await callNFTContract();
    let childRevenue = await contractWithSigner.calculateChildRevenue(_id);
    return childRevenue;
  } catch (error) {
    console.error("Error during calculateChildRevenue:", error);
    /* alert(
      "There was an error during the calculateChildRevenue process. Please try again."
    ); */
    ToastError.fire({
      title:
        "There was an error during the calculateChildRevenue process. Please try again.",
    });
    return false;
  }
};

//Token Functions

//Write Functions

// NFT kontratına kullanıcıdan USDT almak için approve veren fonksiyon
export const callApprove = async (amount: string) => {
  try {
    const { contractWithSigner } = await callTokenContract();
    const { NFTContractAddress } = await callNFTContract();
    let approved = await contractWithSigner.approve(NFTContractAddress, amount);
    await approved.wait();
    return approved;
  } catch (error) {
    console.error("Error during approve:", error);
    /* alert(
      "There was an error during the getApproved process. Please try again."
    ); */
    ToastError.fire({
      title:
        "There was an error during the getApproved process. Please try again.",
    });
    return false;
  }
};
function parseTo18Decimals(number: number) {
  try {
    const parsed = ethers.utils.parseUnits(number.toString(), 18);
    return parsed.toString();
  } catch (error) {
    console.log(error);
    return "";
  }
}
export const checkAllowance = async (price: number) => {
  try {
    const bin = price || 1000;
    const bin18 = parseTo18Decimals(bin);
    let address = localStorage.getItem("address") || "";
    let contrat: string = process.env.NEXT_PUBLIC_CONTRACT || "";
    console.log(address, contrat);
    let allowance = (await callAllowance(address, contrat)) || 0;

    console.log("allowance", ethers.utils.formatEther(allowance));
    let approve;
    if (allowance < price) {
      let res = await callApprove(bin18);
      console.log("approved", res);

      approve = res;
      //console.log("approve", approve);

      return approve;
    } else {
      approve = true;
      console.log("approve", approve);

      return approve;
    }
  } catch (error) {
    console.log(error);

    return false;
  }
};

export function parseIntHex(hexString: string) {
  let res = parseInt(ethers.utils.hexlify(hexString), 16);
  return res;
}

export const callApproveNFT = async () => {
  try {
    const { contractWithSigner } = await callNFTContract();
    let tx = await contractWithSigner.setApprovalForAll(marketContract, true);
    let receipt = await tx.wait();
    const txHash = tx.hash;
    // transaction receipt hash
    return true;
  } catch (error) {
    console.error("Error during approve:", error);
    /* alert("There was an error during the approve process. Please try again."); */
    ToastError.fire({
      title: "There was an error during the approve process. Please try again.",
    });
    return false;
  }
};
export const callApproveNFT2 = async (price?: number) => {
  try {
    const { contractWithSigner } = await callTokenContract();
    const bin18 = parseTo18Decimals(price || 1000);
    let tx = await contractWithSigner.approve(marketContract, bin18);
    let receipt = await tx.wait();
    const txHash = tx.hash;
    // transaction receipt hash
    return true;
  } catch (error) {
    console.error("Error during approve:", error);
    /* alert("There was an error during the approve process. Please try again."); */
    ToastError.fire({
      title: "There was an error during the approve process. Please try again.",
    });
    return false;
  }
};

//Read Functions

export const callAllowance = async (owner: string, spender: string) => {
  try {
    const { contractWithSigner } = await callTokenContract();
    let _allowance = await contractWithSigner.allowance(owner, spender);
    return _allowance;
  } catch (error) {
    console.error("Error during allowance:", error);
    /* alert("There was an error during the allowance process. Please try again."); */
    ToastError.fire({
      title:
        "There was an error during the allowance process. Please try again.",
    });
    return false;
  }
};

export const callBalanceOf = async (account: string) => {
  try {
    const { contractWithSigner } = await callTokenContract();
    let _balanceOf = await contractWithSigner.balanceOf(account);
    return _balanceOf;
  } catch (error) {
    console.error("Error during balanceOf:", error);
    /* alert("There was an error during the balanceOf process. Please try again."); */
    ToastError.fire({
      title:
        "There was an error during the balanceOf process. Please try again.",
    });
    return false;
  }
};

//Marketplace FUNCTIONS

//READ FUNCTIONS
//READ FUNCTIONS

export const callIsApprovedForAll = async (owner: string) => {
  try {
    const { contractWithSigner } = await callNFTContract();
    let isApproved = await contractWithSigner.isApprovedForAll(
      owner,
      marketContract
    );
    return isApproved;
  } catch (error) {
    console.error("Error during isApprovedForAll:", error);
    /* alert(
      "There was an error during the isApprovedForAll process. Please try again."
    ); */
    ToastError.fire({
      title:
        "There was an error during the isApprovedForAll process. Please try again.",
    });
    return false;
  }
};
