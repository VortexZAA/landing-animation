import { BigNumber, ethers } from "ethers";
import { callNFTContract, callNFTContractGhost } from "./etherumContracts";
import { ToastError, ToastSuccess } from "@/components/alert/SweatAlert";
import Ethers from "@/lib/ethers";
import pb from "@/lib/pocketbase";

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

//TODO: Adresler nftsi var mı diye kontrol edilecek olmayanlar için yeni bir array oluşturulacak

export const callBatchRegister = async (addresses: string[], option: number) => {
  try {
    const { contractWithSigner } = await callNFTContract();

    // Create and fill the tiers and parents arrays with 1s
    let tiers;
    if (option === 1) {
      tiers = new Array(addresses.length).fill(1);
    } else if (option === 2) {
      tiers = new Array(addresses.length).fill(2);
    } else if (option === 3) {
      tiers = new Array(addresses.length).fill(3);
    }
    let parents = new Array(addresses.length).fill(1);

    let tx = await contractWithSigner.batchInitialRegister(addresses, tiers, parents);
    let receipt = await tx.wait();
    let hash = tx.hash;
    return { hash: hash, res: receipt };
  } catch (error) {
    console.error("Error during batchRegister:", error);
    /* alert(
      "There was an error during the batchRegister process. Please try again."
    ); */
    ToastError.fire({
      title:
        "There was an error during the batchRegister process. Please try again.",
    });
    return { hash: "", res: "" };
  }
};

export const callHasMinted = async (address: string) => {
  try {
    const { contractWithSigner } = await callNFTContractGhost();
    let hasMinted = await contractWithSigner.hasMinted(address);
    return hasMinted;
  } catch (error) {
    console.error("Error during hasMinted:", error);
    /* alert("There was an error during the hasMinted process. Please try again."); */
    ToastError.fire({
      title:
        "There was an error during the hasMinted process. Please try again.",
    });
    return false;
  }
};

export const callOwnerOf = async (id: number) => {
  try {
    const { contractWithSigner } = await callNFTContractGhost();
    let owner = await contractWithSigner.ownerOf(id);
    return owner;
  } catch (error) {
    console.error("Error during ownerOf:", error);
    /* alert("There was an error during the ownerOf process. Please try again."); */
    ToastError.fire({
      title: "There was an error during the ownerOf process. Please try again.",
    });
    return false;
  }
};

export const callMint = async (address:string) => {
  try {
    const { contractWithSigner } = await callNFTContractGhost();
    const { maxFeePerGas, maxPriorityFeePerGas } = getMaxFeeGas();
    let tx = await contractWithSigner.mint({
      maxFeePerGas: maxFeePerGas,
      maxPriorityFeePerGas: maxPriorityFeePerGas
    });
    let receipt = await tx.wait();
    const txHash = tx.hash;
    ToastSuccess({
      tHashLink: txHash,
    }).fire({
      title: "Mint Successful",
    });
    const create = await pb.collection("helsinki").create({
      address: address,
    });
    return receipt.events[0].args[2].toNumber();
  } catch (error) {
    const err = error as any; // Type assertion

    console.error("Error during minting:", err);

    // Check for user rejection
    if (err.code === "ACTION_REJECTED") {
      /* alert("Transaction was rejected by the user."); */
      ToastError.fire({
        title: "Transaction was rejected by the user.",
      });
    }
    // Check for revert reason: "You have already minted an artwork."
    else if (
      err.message &&
      err.message.includes("You have already minted an artwork")
    ) {
      /* alert("You have already minted a scroll."); */
      ToastError.fire({
        title: "You have already minted a scroll.",
      });
    }
    // Check for insufficient funds
    else if (err.message && err.message.includes("insufficient funds")) {
      /* alert("You do not have enough btc in your account to mint."); */
      ToastError.fire({
        title: "You do not have enough btc in your account to mint.",
      });
    }
    // Generic error message for other cases
    else {
      /* alert(
        "There was an error during the minting process. Please check your btc balance and try again."
      ); */
      ToastError.fire({
        title:
          "There was an error during the minting process. Please check your btc balance and try again.",
      });
    }

    throw err;
  }
};

export async function importToMetamask(id: number, image: string) {
  const ethereum = window.ethereum as any;
  try {
    // Check if MetaMask is installed and Ethereum provider is injected
    if (typeof window.ethereum !== "undefined" && ethereum.isMetaMask) {
      // Use MetaMask's provider
      //const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Suggest adding the NFT to the user's MetaMask assets
      const added = ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC721",
          options: {
            address: process.env.NEXT_PUBLIC_GHOST_MINT, // Replace with your NFT smart contract address
            symbol: "BTC", // Replace with a short string to represent your asset, like 'MYNFT'
            decimals: 0, // ERC721 assets are non-fungible, so decimals is always 0
            image: image, // Use the nftImage state to provide the image URL
            tokenId: id.toString(), // Convert the tokenId to a string
          },
        },
      });

      // If successfully added, the result will be true
      if (added) {
        console.log("Successfully added NFT to MetaMask");
      } else {
        console.error("Something went wrong adding the NFT to MetaMask");
      }
    } else {
      console.error("Please install MetaMask");
    }
  } catch (error) {
    console.error("Error importing NFT to MetaMask:", error);
  }
}

export const callTokenURI = async (id: number) => {
  try {
    const { contractWithSigner } = await callNFTContractGhost();
    let uri = await contractWithSigner.tokenURI(id);
    return uri;
  } catch (error) {
    console.error("Error during tokenURI:", error);
    //alert("There was an error during the tokenURI process. Please try again.");
    ToastError.fire({
      title: "There was an error during the tokenURI process. Please try again.",
    });
    throw error;
  }
};
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
    /* ToastError.fire({
      title:
        "There was an error during the getPrice process. Please try again.",
    }); */
    return false;
  }
};
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
    const {maxFeePerGas, maxPriorityFeePerGas} = getMaxFeeGas();

    let tx = await contractWithSigner.register(
      [refferal, vipTier],
      minterAddres,
      { value: weiValue,
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas
      }
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
        "There was an error during the registering process." 
      ); */
      ToastError.fire({
        title: "There was an error during the registering process.",
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
    const {maxFeePerGas, maxPriorityFeePerGas} = getMaxFeeGas();

    let tx = await contractWithSigner.register(
      [refferal, vipTier],
      minterAddres,
      { value: weiValue,
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas
      }
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
        title: "There was an error during the registering process.",
      });
      console.log(err);
    }

    return false;
  }
};

// NFT'ye özel başklarının NFT almasında kullanıcı referans kodunu oluşturmak için kullanılan fonksiyon
export const callGetReferralCode = async (user: string) => {
  try {
    const { contractWithSigner } = await callNFTContract();
    let NFTID = await contractWithSigner.getNFT(user);
    let refferal = await contractWithSigner.encodeID(NFTID);
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

export const getMaxFeeGas = (): {maxFeePerGas: BigNumber, maxPriorityFeePerGas: BigNumber} => {
  return {
    maxFeePerGas: BigNumber.from(5).mul(Math.pow(10, 7)),
    maxPriorityFeePerGas: BigNumber.from(0)
  }
}