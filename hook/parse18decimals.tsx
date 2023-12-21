import { ethers } from "ethers";

export function parseTo18Decimals(number: number) {
    const parsed = ethers.utils.parseUnits(number.toString(), 18);
    return parsed.toString();
  }