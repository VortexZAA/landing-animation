import { useEffect, useState } from "react";

export default function OKX() {
  const [address, setAddress] = useState("");
  //okx wallet connect function
  const walletConnect = async () => {
    const okxwallet = (window as any).okxwallet;
    console.log("wallet connect");
    okxwallet.request({ method: "eth_requestAccounts" });
    let accounts = await okxwallet.request({ method: "eth_requestAccounts" });
    console.log("accounts1", accounts);
    setAddress(accounts[0]);
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      console.log("chainId1", chainId);
      //@ts-ignore
      (await ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5de" }],
      })) ||
        (await okxwallet.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x5de" }],
        }));
    } catch (switchError: any) {
      console.log(switchError.code);

      // This error code indicates that the chain has not been added to OKX.
      if (switchError.code === 4902) {
        try {
          await okxwallet.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x5de",
                chainName: "BEVM Canary TestNet",
                nativeCurrency: {
                  name: "Bitcoin",
                  symbol: "BTC",
                  decimals: 18,
                },
                rpcUrls: ["https://canary-testnet.bevm.io/"],
                blockExplorerUrls: ["https://scan-canary-testnet.bevm.io/"],
              },
            ],
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  useEffect(() => {
    async () => {
      const { ethereum } = window as any;
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      console.log("chainId1", chainId);
    };
    //@ts-ignore
    okxwallet.on("accountsChanged", (accounts: Array<string>) => {
      console.log("accounts2", accounts);
      setAddress(accounts[0]);
    });
    //@ts-ignore
    okxwallet.on("chainChanged", (chainId: number) => {
      console.log("chainId2", chainId);
    });
  });

  return (
    <main
      className={`flex min-h-[100dvh] w-screen max-w-[100vw] overflow-x-hidden gap-6  items-start p-6 justify-between z-20 relative wrap`}
    >
      <div className=" text-white flex flex-col gap-3 w-full">
        <div className="flex justify-between  container mx-auto w-full">
          <h2 className="text-white text-3xl z-20">OKX</h2>
          <div className="flex flex-col gap-2">
            <button
              onClick={walletConnect}
              className="bg-white text-black px-4 py-2 rounded-md"
            >
              Connect
            </button>
            address: {address}
          </div>
        </div>
      </div>
    </main>
  );
}