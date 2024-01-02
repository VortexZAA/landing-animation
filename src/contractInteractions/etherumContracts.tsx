"use client";
import { ethers } from "ethers";
import bnbNFT from "@/abi/bnbMLM.json";
import bevmNFT from "@/abi/bevmMLM.json";
import mapoNFT from "@/abi/mapoMLM.json";
import tokenAbi from "@/abi/token.json";
import { useAppSelector } from "@/hook/redux/hooks";
import { selectData } from "@/redux/auth/auth";
declare global {
  interface Window {
    ethereum: any;
  }
}
const NFTContractBNB = process.env.NEXT_PUBLIC_CONTRACT as string;
const NFTContractBEVM = process.env.NEXT_PUBLIC_CONTRACT2 as string;
const NFTContractMAPO = process.env.NEXT_PUBLIC_CONTRACT3 as string;

export const callNFTContract = async () => {
  const chainId = localStorage.getItem("chainId");
  const metamaskAddress = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const msgSender = metamaskAddress[0];
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const abi = chainId === "0x38" ? bnbNFT : (chainId === "0x5dd" ? bevmNFT : mapoNFT);
  const NFTContractAddress =
    chainId === "0x38" ? NFTContractBNB : (chainId === "0x5dd" ? NFTContractBEVM : NFTContractMAPO);
    console.log(chainId, NFTContractAddress);
    
  const NFTContract = new ethers.Contract(NFTContractAddress, abi, signer);
  const contractWithSigner = NFTContract.connect(signer);
  return { contractWithSigner, NFTContractAddress, abi, msgSender };
};
