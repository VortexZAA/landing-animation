import { ethers } from "ethers";
import {
  callNFTContract,
} from "./etherumContracts";
import { ToastError } from "@/components/alert/SweatAlert";
import Ethers from "@/lib/ethers";

//**************************************************************
/*
TODO:
Fonksiyonlar bevm için ayrı bnb için ayrı çağırılacağıından 
contractWithSigner'ı fonksiyonlara parametre olarak göndermek gerekecek.
Networke göre doğru contractWithSigner seçildiğinden emin olunmalı.
*/

const marketContract = process.env.NEXT_PUBLIC_MARKETPLACE as string;
const tokenContract = process.env.NEXT_PUBLIC_TOKEN as string;
//NFT Functions

// NFT satın almak için kullanılan fonksiyon
//BNB NFT
export const callGetNFTPrice = async (tier: number) => {
  try {
    const { contractWithSigner } = await callNFTContract();
    let price = await contractWithSigner.getNFTPrice(tier);
    console.log("price", price);
    console.log();
    
    
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
}
export const callRegisterForBNB = async (
  refferal: number,
  vipTier: number,
  minterAddres: string,
  etherAmount?: string
) => {
  try {
    const { contractWithSigner } = await callNFTContract();
    let priceOfTier1 = await callGetNFTPrice(1);
    let priceOfTier2 = await callGetNFTPrice(2);
    let priceOfTier3 = await callGetNFTPrice(3);
    const weiValue =
      vipTier === 1
        ? priceOfTier1
        : vipTier === 2
        ? priceOfTier2
        : priceOfTier3;
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

//BEVM NFT
export const callRegister = async (
  refferal: string,
  vipTier: number,
  minterAddres: string,
  etherAmount?: string
) => {
  try {
    const { contractWithSigner } = await callNFTContract();
    const chainId = localStorage.getItem("chainId");
    let priceOfTier1, priceOfTier2, priceOfTier3;
    
    priceOfTier1 = await contractWithSigner.getNFTPrice(1);
    priceOfTier2 = await contractWithSigner.getNFTPrice(2);
    priceOfTier3 = await contractWithSigner.getNFTPrice(3);

    const weiValue =
      vipTier === 1
        ? priceOfTier1
        : vipTier === 2
        ? priceOfTier2
        : priceOfTier3;
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
export const callWithdraw = async (amount: number) => {
  try {
    const { contractWithSigner } = await callNFTContract();
    let tx = await contractWithSigner.withdrawReward(amount);
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

export const callRefresh = async () => {
  try {
    const { contractWithSigner } = await callNFTContract();
    let tx = await contractWithSigner.refresh();
    let receipt = await tx.wait();
    let hash = tx.hash;
    return { hash: hash, res: receipt };
  } catch (error) {
    console.error("Error during refresh:", error);
    /* alert("There was an error during the refresh process. Please try again."); */
    ToastError.fire({
      title: "There was an error during the refresh process. Please try again.",
    });
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
    const weiValue =
      tier === 1
        ? process.env.NEXT_PUBLIC_TIER1
        : tier === 2
        ? process.env.NEXT_PUBLIC_TIER2
        : process.env.NEXT_PUBLIC_TIER3;
    console.log("weiValue", weiValue);

    let tx = await contractWithSigner.upgradeTier(tier, { value: weiValue });
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

function parseTo18Decimals(number: number) {
  try {
    const parsed = ethers.utils.parseUnits(number.toString(), 18);
    return parsed.toString();
  } catch (error) {
    console.log(error);
    return "";
  }
}


export function parseIntHex(hexString: string) {
  let res = parseInt(ethers.utils.hexlify(hexString), 16);
  return res;
}

