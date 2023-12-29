import Image from "next/image";
import { Inter } from "next/font/google";
import React, { useEffect, useRef, useState } from "react";
import Mint from "@/components/brc20/mint";
import Deploy from "@/components/brc20/deploy";
import Transfer from "@/components/brc20/transfer";
import Header from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("mint");

  const [unisatInstalled, setUnisatInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [publicKey, setPublicKey] = useState("");
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("testnet");
  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  });

  const getBasicInfo = async () => {
    const unisat = (window as any).unisat;
    unisat.requestAccounts();
    const [address] = await unisat.getAccounts();
    setAddress(address);

    const publicKey = await unisat.getPublicKey();
    setPublicKey(publicKey);

    const balance = await unisat.getBalance();
    setBalance(balance);

    const network = await unisat.getNetwork();
    setNetwork(network);
    console.log(address, publicKey, balance, network);
  };
  const selfRef = useRef<{ accounts: string[] }>({
    accounts: [],
  });
  const self = selfRef.current;
  const handleAccountsChanged = (_accounts: string[]) => {
    if (self.accounts[0] === _accounts[0]) {
      // prevent from triggering twice
      return;
    }
    self.accounts = _accounts;
    if (_accounts.length > 0) {
      setAccounts(_accounts);
      setConnected(true);

      setAddress(_accounts[0]);

      getBasicInfo();
    } else {
      setConnected(false);
    }
  };
  const handleNetworkChanged = (network: string) => {
    setNetwork(network);
    getBasicInfo();
  };

  return (
    <>
      <Header />

      <main
        className={`flex relative  min-h-screen w-full flex-col items-center justify-center p-6  ${inter.className}`}
      >
        {address ? (
          <div className="absolute z-50 top-6 right-6 bg-btnActive text-white rounded-lg px-3 py-2 text-center border-2">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        ) : (
          <button
            onClick={() => getBasicInfo()}
            className="absolute z-50 top-5 right-6 bg-gray-100 rounded-lg px-3 py-2 text-center border-2"
          >
            Connect
          </button>
        )}
        <div className="form backdrop-blur-sm p-6 max-w-4xl mx-auto w-full z-50">
          <div className="w-full backdrop-blur-md bg-white/20  p-6 rounded-xl flex flex-col justify-center py-10 gap-6">
            <div className="flex w-full justify-between">
              {["mint", "deploy", "transfer"].map((tab) => (
                <button
                  onClick={() => setSelectedTab(tab)}
                  disabled={tab === "transfer"}
                  className={`bg-btnActive text-white rounded-lg px-3 py-2 text-center border-2  hover:border-white transition-colors ${
                    tab === selectedTab ? "border-white" : "border-transparent"
                  } `}
                >
                  {tab}
                </button>
              ))}
            </div>
            {selectedTab === "mint" && <Mint address={address} />}
            {selectedTab === "deploy" && <Deploy address={address} />}
            {selectedTab === "transfer" && <Transfer address={address} />}
          </div>
        </div>
      </main>
      <Footer status={true} />
    </>
  );
}
