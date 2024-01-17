import { ToastError } from "@/components/alert/SweatAlert";
import Footer from "@/components/footer";
import Header from "@/components/header";
import pb from "@/lib/pocketbase";
import { ethers } from "ethers";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import Ethers from "@/lib/ethers";
export default function Intro() {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [selectNetwork, setSelectedNetwork] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState({ id: "", claimed: false, network: "" });
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 700);
    //reload
    getClaimedCount();
  }, []);

  const [address, setAddress] = useState("");
  async function connect() {
    try {
      const { provider, ethereum } = Ethers();
      await ethereum.send("eth_requestAccounts");
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log(address);
      setAddress(address);
      return address;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async function Check() {
    try {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const sign = await signer.signMessage("claim check");
      const address = await signer.getAddress();
      console.log(address);
      if (sign) {
        const check: any = await pb
          .collection("claim_badge_new")
          .getFirstListItem(`address="${address}"`)
          .then((res) => {
            console.log(res);
            return res;
          })
          .catch((err) => {
            console.log(err);
            return false;
          });
        console.log("check", check);
        if (check) {
          setMsg("You are whitelisted");
          setIsOpen(true);
          setUserId(check);
          check.claimed
            ? await claim(check.network, check)
            : setSelectedTabs(1);
        } else {
          setMsg("You are not eligible 😦");
          setSelectedTabs(2);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function claim(network: string, userData: any) {
    console.log("claiming");
    try {
      if (!userData.claimed) {
        const claim = await pb
          .collection("claim_badge_new")
          .update(userId.id, {
            claimed: true,
            network: network,
          })
          .then((res) => {
            console.log(res);
            return true;
          })
          .catch((err) => {
            console.log(err);
            return false;
          });
        console.log("claim", claim);
        if (claim) {
          setMsg(
            `Your badge will be sent to your wallet on the ${network} network in 24h`
          );
          setSelectedTabs(2);
          setSuccess(true);
        } else {
          ToastError.fire({
            title: "Something went wrong please try again later",
          });
        }
      } else {
        setSelectedTabs(2);
        setSuccess(true);
        setMsg(
          `You have already claimed your badge at ${userData?.network} network `
        );
      }
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  }
  const [selectedTabs, setSelectedTabs] = useState(0);
  const [claimSelected, setClaimSelected] = useState(false);
  const [claimedCount, setClaimedCount] = useState(0);
  const [totalClaimList, setTotalClaimList] = useState(0);
  async function getClaimedCount() {
    try {
      let res1 = await pb.collection("claim_badge_new").getFullList();
      console.log(res1);
      setTotalClaimList(res1.length);
      let res = await pb.collection("claim_badge_new").getFullList({
        filter: `claimed=true`,
      });
      console.log(res);
      setClaimedCount(res.length);
      return res.length;
    } catch (error) {
      console.log(error);
      ToastError.fire({
        title: "Something went wrong please try again later",
      });
      setClaimedCount(0);
      setTotalClaimList(0);
      return false;
    }
  }

  return (
    <>
      {show && <Header />}

      <div className="text-sm  md:text-xl w-full xl:w-2/3  h-[75vh] xl:h-[80vh] text-center z-20  fixed top-1/2 left-1/2  flex items-center flex-col transform -translate-x-1/2 -translate-y-1/2 gap-6 text-white launch animate-fadeIn3 overflow-y-auto overflow-x-hidden px-3 xl:px-0">
        {!claimSelected && (
          <div className="flex flex-col xl:flex-row gap-3 w-full h-full items-start pt-4 pb-16 xl:py-6 ">
            <div className="w-full sm:w-2/3 md:w-1/3 flex h-full items-center justify-center">
              {/* <img src="/logo.png" alt="" className="w-5/6" /> */}
              <div id="container" className="w-full flex flex-col items-center">
                <div id="spooky">
                  <div id="body" className="!w-2/3 !mt-0 h-40 sm:!h-52">
                    <div id="eyes" className="!w-2/3 "></div>
                    <div id="mouth" className=""></div>
                    <div id="feet" className="!w-full max-w-full">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
                <div id="shadow" className="!w-1/2"></div>
              </div>
            </div>
            <div className="w-full px-3 xl:px-0 xl:w-2/3 flex flex-col text-left gap-3 text-sm pt-3 pb-12">
              <h2 className="text-xl md:text-2xl font-semibold">
                <span className="text-green-700">SoulBound Badge</span> is the
                community pass for the SoulBound Protocol
              </h2>
              <p>
                SOULBOUND Badges are not ordinary NFTs; they are your Entry
                Tickets to the SOULBOUND ecosystem. Holding a Badge is a
                prerequisite for engaging in and benefiting from various
                activities within the SOULBOUND ecosystem. Having a Badge means
                that the user has a whitelist.
              </p>
              <div className="my-2">
                <h3>Airdrop Rules</h3>
                <Link
                  target="_blank"
                  href={
                    "https://medium.com/@soulboundbtc/embrace-the-power-of-badges-your-key-to-unlocking-the-soulbound-ecosystem-part-i-734cea7d27d3"
                  }
                  className="text-green-700"
                >
                  About SoulBound Badge
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <h3>Benefits</h3>
                <p>
                  1, Badge Value: Common (equivalent 100$), Epic (equivalent
                  500$), Legendary (equivalent 1000$) <br />
                  2, Branching Rewards: means that you receive a percentage of
                  the reward (depending on your SoulBound BADGE tier) whenever a
                  new user uses your referral code to buy the BADGE (10-14% in
                  BTC or BNB). <br />
                  3, Will be your ticket to participate in BTC launchpad IDO
                  projects. <br />
                  4, More future airdrop anticipation
                </p>
              </div>
              <div className="flex items-center gap-16 mobile:block">
                <button
                  onClick={async () => {
                    (await connect()) && setClaimSelected(true);
                  }}
                  className="w-[320px] flex border mobile:w-full mobile:mb-8 cursor-pointer border-green-700 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-green-700 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="w-14 h-10 px-1"
                    >
                      <path
                        fill="currentColor"
                        d="M3 11H2v2h1zm18.707 1.707a1 1 0 0 0 0-1.414l-6.364-6.364a1 1 0 1 0-1.414 1.414L19.586 12l-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364M3 13h18v-2H3z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex-1 text-center relative">
                    <div className="relative flex  h-12 flex-col justify-center gap-2">
                      <div className="absolute top-0 left-0 h-full bg-green-700 w-0 transition-all group-hover:w-full"></div>
                      <p className="relative text-subtitle leading-none text-green-700 group-hover:text-white font-semibold">
                        Claim
                      </p>
                    </div>
                  </div>
                </button>
              </div>
              {/* progress bar  */}
              <div className="mt-5 space-y-2 flex flex-col items-center w-fit">
                <div className="w-[320px] h-6 bg-[#ebedf2] dark:bg-dark/40 rounded-full relative">
                  <div
                    className="bg-green-500 h-6 rounded-full text-center text-black font-bold flex justify-between items-center px-2 text-xs"
                    style={{
                      width: `${
                        claimedCount / totalClaimList >= 1
                          ? 100
                          : (claimedCount+50) / 1000 *100
                      }%`,
                    }}
                  >
                    <span>{claimedCount + 50}/1000</span>
                    {/* <span>
                      {claimedCount / totalClaimList >= 1
                        ? 100
                        : claimedCount / totalClaimList}
                      %
                    </span> */}
                  </div>
                </div>
                <h4>Claim Progress</h4>
              </div>
            </div>
          </div>
        )}
        {claimSelected && (
          <div className="hidden lg:block w-full pt-6">
            <div className="flex w-full mb-3 gap-3 text-sm">
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.id}
                  activeId={selectedTabs}
                  text={tab.text}
                  id={tab.id}
                  index={index}
                />
              ))}
            </div>
            <div
              className="relative flex w-full h-[1px] translate-x-6"
              /* style="background: linear-gradient(90deg, rgb(24, 209, 70) 0%, rgb(220, 246, 144) 100%);" */
              style={{
                background:
                  "linear-gradient(90deg, rgb(24, 209, 70) 0%, rgb(220, 246, 144) 100%)",
              }}
            >
              {tabs.map((tab, index) => (
                <div
                  className={` relative flex-1 h-[1px] ${
                    selectedTabs >= index
                      ? "bg-transparent group active"
                      : "bg-[#2B2B2B]"
                  } `}
                >
                  <div
                    key={tab.id}
                    className={`absolute -top-[4px] -left-[4px] h-3 w-3 rounded-full  ${
                      selectedTabs >= index ? "bg-green-700" : "bg-[#69706B]"
                    }`}
                  ></div>
                </div>
              ))}
            </div>
            <div>
              <div className="pt-8 h-full">
                {selectedTabs === 0 && (
                  <div className="xl:w-[600px] mx-auto px-6 py-6 flex flex-col gap-2 bg-[#262626] rounded-3xl h-fit w-full  text-left">
                    <div className=" border border-[#393939] rounded-2xl  px-6 pt-3 overflow-hidden ">
                      <h3 className="text-2xl leading-[39px] text-white font-light">
                        Sign Your Message
                      </h3>
                      <p className="text-xl leading-[39px] font-extrabold ">
                        Wallet
                      </p>
                      <Player
                        autoplay
                        loop
                        src="/ghost.json"
                        style={{
                          height: "auto",
                          width: "150px",
                          marginTop: "-20px",
                        }}
                      ></Player>
                    </div>
                    <h2 className="mb-1 text-lg xl:text-xl font-semibold text-white">
                      Get Started
                    </h2>
                    <p className="mb-1 text-sm font-medium text-g-6">
                      Get started by connecting your wallet to verify your
                      eligibility for the SoulBound Badge Airdrop. Simply
                      connect your wallet to proceed.
                    </p>
                    <p className="mb-1 text-sm font-medium text-g-6">
                      Your currently connected address:
                    </p>
                    <p className="mb-3 text-sm font-medium text-white break-words">
                      {address}
                    </p>
                    <button
                      onClick={Check}
                      className="w-full flex items-center justify-center rounded-xl text-xl font-semibold text-black bg-white h-12 transition-all hover:bg-[#D4DDD6]"
                    >
                      Sign Message
                    </button>
                  </div>
                )}
                {selectedTabs === 1 && (
                  <div className="xl:w-[600px] mx-auto px-10 py-10 flex flex-col gap-2 bg-[#262626] rounded-3xl h-fit w-full  text-left">
                    {isOpen && (
                      <div className=" text-white flex flex-col -mt-3 font-bold text-base gap-2 w-full ">
                        <h3 className="text-[28px] leading-[39px] text-white font-light">
                          Select Network
                        </h3>

                        <h4 className="font-semibold w-full text-left">
                          Congratulations you are eligible, now please select
                          the network to claim
                        </h4>
                        <div className="grid md:grid-cols-3 w-full gap-3 md:gap-6 mt-3 px-0 text-white">
                          <button
                            onClick={() => {
                              //setSelectedChain("0x38");
                              claim("BSC", userId);
                            }}
                            className="w-full flex h-14 p-3 border-2  justify-start items-center transition-colors text-xs gap-2 rounded-md"
                          >
                            <img src="/bnb.svg" alt="" className="h-full" />
                            BNB Chain
                          </button>
                          <button
                            onClick={() => {
                              //setSelectedChain("0x5dd");
                              claim("BEVM", userId);
                            }}
                            className="w-full h-14 p-3 border-2 flex justify-start items-center transition-colors text-xs gap-2 rounded-md"
                          >
                            <img
                              src="/bevmicon.svg"
                              alt=""
                              className="h-8 -mx-2"
                            />
                            BEVM Chain
                          </button>
                          <button
                            onClick={() => {
                              //setSelectedChain("0x58f8");
                              claim("MAP", userId);
                            }}
                            className="w-full h-14 p-3 border-2 flex justify-start items-center transition-colors text-xs gap-2 rounded-md"
                          >
                            <img src="/mapo.png" alt="" className="h-full" />
                            Map Chain
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {selectedTabs === 2 && (
                  <div className="xl:w-[600px] mx-auto px-6 py-6 flex flex-col gap-2 bg-[#262626] rounded-3xl h-fit w-full  text-left">
                    <div className="border border-[#393939] rounded-2xl pt-6 px-6 mb-0 ">
                      <h3 className="text-2xl leading-[39px]  font-light">
                        Check Airdrop
                      </h3>
                      <p className="text-base leading-[39px] font-bold mb-6">
                        {success ? msg : "You are not eligible."}
                      </p>
                      {success ? (
                        <Player
                          autoplay
                          loop
                          src="/smile.json"
                          style={{
                            height: "auto",
                            width: "150px",
                            marginTop: "-30px",
                          }}
                        ></Player>
                      ) : (
                        <Player
                          autoplay
                          loop
                          src="/sad.json"
                          style={{
                            height: "auto",
                            width: "150px",
                            marginTop: "-50px",
                          }}
                        ></Player>
                      )}
                    </div>
                    {success ? (
                      ""
                    ) : (
                      <>
                        <h2 className="my-3 text-sm md:text-base font-semibold text-g-1">
                          Oops! It seems you're not on the whitelist.
                        </h2>
                        <Link
                          target="_blank"
                          href={"https://discord.com/invite/soulboundprotocol"}
                        >
                          <button className="w-full rounded-xl text-md font-semibold text-black bg-white py-2.5 text-xl transition-all hover:bg-[#D4DDD6]">
                            Join the Community!
                          </button>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {show && <Footer status={true} />}
    </>
  );
}

function Tab({ activeId, text, id, index }: any) {
  return (
    <div
      className={`flex items-center gap-2 flex-1 group w-full ${
        activeId >= index && "active"
      } `}
    >
      <div className="flex items-center justify-center text-[12px] xl:text-sm font-medium bg-gray-400 text-disabled-text w-10 h-10 rounded-full group-[.active]:text-white group-[.active]:bg-green-700">
        {id}
      </div>
      <span className="text-md text-disabled group-[.active]:text-white">
        {text}
      </span>
    </div>
  );
}

const tabs = [
  {
    id: "01",
    text: "",
  },
  {
    id: "02",
    text: "",
  },
  {
    id: "03",
    text: "",
  },
];
