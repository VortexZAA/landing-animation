import { ethers } from "ethers";
import nftAbi from "@/abi/nft.json";
import tokenAbi from "@/abi/token.json";
declare global {
  interface Window {
    ethereum: any;
  }
}

export const callNFTContract = async () => {
  const metamaskAddress = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const msgSender = metamaskAddress[0];
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const abi = nftAbi;
  const NFTContractAddress = process.env.NEXT_PUBLIC_CONTRACT as string;
  const NFTContract = new ethers.Contract(NFTContractAddress, abi, signer);
  const contractWithSigner = NFTContract.connect(signer);
  return { contractWithSigner, NFTContractAddress, abi, msgSender };
};
export const callTokenContract = async () => {
  const metamaskAddress = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const msgSender = metamaskAddress[0];
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const abi = tokenAbi;
  const tokenContractAddress = process.env.NEXT_PUBLIC_TOKEN as string;
  const tokenContract = new ethers.Contract(tokenContractAddress, abi, signer);
  const contractWithSigner = tokenContract.connect(signer);
  return { contractWithSigner, tokenContractAddress, abi, msgSender };
};




export const callNFTContractBiget = async () => {
  //@ts-ignore
  const metamaskAddress = await window.bitkeep.ethereum.request({
    method: "eth_requestAccounts",
  });
  const msgSender = metamaskAddress[0];
  //@ts-ignore
  const provider = new ethers.providers.Web3Provider(window.bitkeep.ethereum);
  const signer = provider.getSigner();
  const abi = nftAbi;
  const NFTContractAddress = process.env.NEXT_PUBLIC_CONTRACT as string;
  const NFTContract = new ethers.Contract(NFTContractAddress, abi, signer);
  const contractWithSigner = NFTContract.connect(signer);
  return { contractWithSigner, NFTContractAddress, abi, msgSender };
};