"use client";
import { ethers } from "ethers";
import bnbNFT from "@/abi/bnbMLM.json";
import bevmNFT from "@/abi/bevmMLM.json";
import polygonNFT from "@/abi/bevmMLM.json";
import bevmGhost from "@/abi/ghostMint.json";
declare global {
  interface Window {
    ethereum: any;
  }
}
const NFTContractBNB = process.env.NEXT_PUBLIC_CONTRACT as string;
const NFTContractBEVM = process.env.NEXT_PUBLIC_CONTRACT2 as string;
const NFTContractPOLGON = process.env.NEXT_PUBLIC_CONTRACT3 as string;
const NFTContractGhost = process.env.NEXT_PUBLIC_GHOST_MINT as string;

export const callNFTContract = async () => {
  const chainId = localStorage.getItem("chainId");
  const metamaskAddress = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const msgSender = metamaskAddress[0];
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const abi = chainId === "0x38" ? bnbNFT : (chainId === "0x5dd" ? bevmNFT : polygonNFT);
  const NFTContractAddress =
    chainId === "0x38" ? NFTContractBNB : (chainId === "0x5dd" ? NFTContractBEVM : NFTContractPOLGON);
    console.log(chainId, NFTContractAddress);
    
  const NFTContract = new ethers.Contract(NFTContractAddress, abi, signer);
  const contractWithSigner = NFTContract.connect(signer);
  return { contractWithSigner, NFTContractAddress, abi, msgSender };
};
export const callNFTContractGhost = async () => {
  const chainId = localStorage.getItem("chainId");
  const metamaskAddress = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const msgSender = metamaskAddress[0];
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const abi = bevmGhost;
  const NFTContractAddress= NFTContractGhost;
    console.log(chainId, NFTContractAddress);
    
  const NFTContract = new ethers.Contract(NFTContractAddress, abi, signer);
  const contractWithSigner = NFTContract.connect(signer);
  return { contractWithSigner, NFTContractAddress, abi, msgSender };
};
