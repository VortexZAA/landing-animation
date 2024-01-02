import Image from "next/image";
import { useState } from "react";
import Layout from "@/layout/layout";

import { useAppDispatch, useAppSelector } from "@/hook/redux/hooks";
import { selectData, setLoading } from "@/redux/auth/auth";
import Loading from "@/components/loading";
import AnimateHeight from "react-animate-height";

export default function Home() {
  const [selected, setSelected] = useState(1);
  const [active, setActive] = useState<string>("0");
  const toggleFaq = (value: string) => {
    setActive((oldValue) => {
      return oldValue === value ? "" : value;
    });
  };

  return (
    <>
      <Layout title="FAQ">
        <div className="flex flex-col gap-12  h-[80vh] w-full justify-start items-center backdrop-blur-sm bg-white/10 rounded-xl shadow-md overflow-auto py-6">
          <div
            id="faq"
            className="flex flex-col gap-6 xl:gap-10 items-center  w-full"
          >
            {/*             <h1>FAQ</h1> */}
            <div className="mb-5 flex flex-col gap-3 md:gap-6 w-full items-center justify-start">
              <h2 className="text-white text-xl w-2/3">
                General Understanding:
              </h2>
              <div className="flex flex-col gap-3 font-semibold w-full lg:w-2/3">
                {faqs1.map((faq) => (
                  <CardFaq
                    key={faq.id}
                    faq={faq}
                    toggleFaq={toggleFaq}
                    active={active}
                  />
                ))}
              </div>
            </div>
            <div className="mb-5 flex flex-col gap-3 md:gap-6 w-full items-center justify-start">
              <h2 className="text-white text-xl w-2/3">
                Functionality and Features:
              </h2>
              <div className="flex flex-col gap-3 font-semibold w-full lg:w-2/3">
                {faqs2.map((faq) => (
                  <CardFaq
                    key={faq.id}
                    faq={faq}
                    toggleFaq={toggleFaq}
                    active={active}
                  />
                ))}
              </div>
            </div>
            <div className="mb-5 flex flex-col gap-3 md:gap-6 w-full items-center justify-start">
              <h2 className="text-white text-xl w-2/3">
                Governance and Tokenomics:
              </h2>
              <div className="flex flex-col gap-3 font-semibold w-full lg:w-2/3">
                {faqs3.map((faq) => (
                  <CardFaq
                    key={faq.id}
                    faq={faq}
                    toggleFaq={toggleFaq}
                    active={active}
                  />
                ))}
              </div>
            </div>
            <div className="mb-5 flex flex-col gap-3 md:gap-6 w-full items-center justify-start">
              <h2 className="text-white text-xl w-2/3">
                Roadmap and Future Plans:
              </h2>
              <div className="flex flex-col gap-3 font-semibold w-full lg:w-2/3">
                {faqs4.map((faq) => (
                  <CardFaq
                    key={faq.id}
                    faq={faq}
                    toggleFaq={toggleFaq}
                    active={active}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
function CardFaq({ faq, toggleFaq, active }: any) {
  return (
    <div className="border-white/25 text-xs md:text-sm 2xl:text-base text-left  flex flex-col items-center justify-cente font-medium md:font-semibold border bg-[#0D0D0D1A]/10 backdrop-blur-sm rounded-2xl transition-all">
      <button
        type="button"
        className={`p-4 w-full flex items-center gap-4 md:gap-4 xl:gap-6 text-left min-h-[90px] justify-between text-white-dark  ${
          active === faq.id.toString() ? "!text-primary" : ""
        }`}
        onClick={() => faq.answer && toggleFaq(faq.id.toString())}
      >
        <span className="leading-relaxed 2xl:leading-7 w-full">
          {faq.question}
        </span>
        {faq.answer && (
          <div
            className={` ${
              active === faq.id.toString()
                ? "rotate-180 pl-[1px]"
                : " rotate-0 pl-[1px]"
            } border border-white rounded-full transition-all transform flex justify-center items-center w-7 h-7 xl:w-9 xl:h-9 shrink-0 `}
          >
            {arrow}
          </div>
        )}
      </button>
      <div className="w-full ">
        <AnimateHeight
          duration={300}
          height={active === faq.id.toString() ? "auto" : 0}
        >
          <div className="flex flex-col gap-2 p-4 text-white-dark text-xs md:text-sm font-normal md:font-medium border-t border-[#d3d3d3]/50 w-full px-4 md:px-6">
            <span>{faq.answer}</span>
            {faq.img && <img src={faq.img} alt="" className="w-full h-fit" />}
          </div>
        </AnimateHeight>
      </div>
    </div>
  );
}

const arrow = (
  <svg
    className="w-8 h-8"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.95211 19.2209L16.2438 26.5126C16.3825 26.6453 16.546 26.7494 16.725 26.8188C17.0801 26.9647 17.4783 26.9647 17.8334 26.8188C18.0124 26.7494 18.1759 26.6453 18.3146 26.5126L25.6063 19.2209C25.7422 19.0849 25.8501 18.9235 25.9237 18.7459C25.9973 18.5682 26.0352 18.3778 26.0352 18.1855C26.0352 17.7971 25.8809 17.4247 25.6063 17.1501C25.3317 16.8755 24.9592 16.7212 24.5709 16.7212C24.1825 16.7212 23.81 16.8755 23.5354 17.1501L18.7375 21.9626L18.7375 10.8938C18.7375 10.5071 18.5839 10.1361 18.3104 9.86263C18.0369 9.58914 17.666 9.43549 17.2792 9.43549C16.8924 9.43549 16.5215 9.58914 16.248 9.86263C15.9745 10.1361 15.8209 10.5071 15.8209 10.8938L15.8209 21.9626L11.0229 17.1501C10.8874 17.0134 10.7261 16.9049 10.5484 16.8309C10.3707 16.7568 10.18 16.7187 9.98752 16.7187C9.79501 16.7187 9.60439 16.7568 9.42668 16.8309C9.24897 16.9049 9.08768 17.0134 8.95211 17.1501C8.81542 17.2856 8.70693 17.4469 8.63289 17.6247C8.55885 17.8024 8.52073 17.993 8.52073 18.1855C8.52073 18.378 8.55885 18.5686 8.63289 18.7463C8.70693 18.924 8.81542 19.0853 8.95211 19.2209Z"
      fill="white"
    />
  </svg>
);
const faqs1 = [
  {
    id: 1,
    question: "1. What is the SOULBOUND Protocol?",
    answer:
      "SOULBOUND is a community-driven, incenƟve-based investment plaƞorm designed to incentivize users to build the Bitcoin ecosystem. It acts as an upgraded launchpad 2.0, turning retail investors into mini VCs and allowing them to build their own investor networks with incentives",
  },
  {
    id: 2,
    question:
      "2. What problem does SOULBOUND aim to solve within the blockchain world?",
    answer:
      "SOULBOUND seeks to change the perception  of retail investors, empowering them as a collective  force rather than individual entities. It aims to create a system where retail investors can act as venture capitalists, using their networks to support startupsand projects. It encourages users to invest, build networks, and earn rewards based on their contributions to the system.",
  },
];
const faqs2 = [
  {
    id: 3,
    question: "1. How does the SOULBOUND Protocol reward participants?",
    answer: (
      <>
        SOULBOUND's earning mechanism is based on referral rewards: <br />
        <strong>Branching Rewards:</strong> Branching rewards means that you
        receive a percentage of the payment (depending on your SoulBound BADGE
        trait) whenever a new user uses your referral code to buy SoulBound
        BADGE.
        <br />
      </>
    ),
    img: "/faq-img.png",
  },
  {
    id: 5,
    question:
      "2. What are the different Badge tiers within SOULBOUND, and how do they function?",
    answer: (
      <>
        <strong>Tiers:</strong> There are three badge tiers:{" "}
        <strong>Common</strong> – equivalent value of 100 USDT,{" "}
        <strong>Epic</strong> – equivalent value of 500 USDT,{" "}
        <strong>Legendary</strong> – equivalent of 1000 USDT. <br />
        <strong>Usage:</strong> <br />
        With SoulBound BADGE, users can create their own networks and start
        earning BTC/BNB from reward mechanism - users earn branching rewards
        when others use their referral code and harvesting rewards from revenue
        in their branches. <br />
        Users can participate in <strong>projects IDO</strong> launching on
        the Soulbound Launchpad according to their different Badge Tier.
      </>
    ),
    img: "/faq-img-2.png",
  },
  {
    id: 6,
    question:
      "3. What distinguishes the SOULBOUND Launchpad from traditional launchpads?",
    answer: (
      <>
        SOULBOUND Launchpad focus on Bitcoin Ecosystem.
        <br />
        SOULBOUND Launchpad is community-based and incentive-driven. It allows
        users to participate based on their BADGE tier, fostering a network of
        investors who can invest in upcoming projects within the Bitcoin
        ecosystem.
      </>
    ),
  },
  {
    id: 7,
    question:
      "4. Elaboration on the EVM compatibility and multi-wallet support within the SOULBOUND Protocol?",
    answer: (
      <>
        SOULBOUND aims to integrate multiple wallets within the BTC ecosystem,
        gradually including Unisat, OKX web3, Xverse, and more, making it the
        main launchpad within the BTC ecosystem. It also focuses on EVM
        compatibility for broader blockchain integration, currently live on BTC
        Layer2 BEVM, more in the near future.
      </>
    ),
  },
  {
    id: 8,
    question:
      "5. What is BRC-20 and RGB-20 minting, tool Taproot Asset Creation tool?",
    answer: (
      <>
        <strong>BRC-20 Minting: </strong> <br />
        BRC-20 Minting refers to the process of creating tokens that adhere to
        the BRC-20 standard. Users can deploy and mint their own BRC-20 tokens
        directly from the SoulBound platform.
        <strong>RGB-20 Minting:</strong> <br />
        <strong>
          RGB-20 refers to a smart contract-enabled Layer-2 (L2) and Layer-3
          (L3) protocol built
        </strong>{" "}
        on top of the Bitcoin base layer (LNP/BP) and the Lightning Network.
        RGB-20 Minting is a feature offered by the SoulBound Protocol that
        allows users to create tokens adhering to the RGB-20 standard. This tool
        facilitates the creation of tokens on the Bitcoin network that are
        compatible with the RGB protocol.
        <strong>Taproot Asset Creation:</strong> <br />
        Taproot is a Bitcoin protocol upgrade that brings improvements in
        privacy, security, and flexibility to the network. Taproot Assets
        (formerly known as Taro) refer to assets issued on the Bitcoin
        blockchain using the Taproot protocol. These assets can be transferred
        over the Lightning Network for instant, high-volume, and low-fee
        transactions.
        <br />
        The Taproot Asset Creation tool provided by SoulBound allows users to
        issue assets on the Bitcoin blockchain using the Taproot protocol. This
        tool leverages the security and stability of the Bitcoin network while
        enabling fast, scalable, and cost-effective asset transactions over the
        Lightning Network.
      </>
    ),
  },
];

const faqs3 = [
  {
    id: 9,
    question: "1. What is the $SBB token within the SOULBOUND Protocol?",
    answer: (
      <>
        The $SBB token is the governance token of the SOULBOUND Protocol. It
        represents a decentralized governance mechanism enabling holders to
        participate in the protocol's decision-making process.{" "}
        <span className="text-red-600">
          Branching Rewards means that you receive a percentage
        </span>
      </>
    ),
    img: "",
  },
  {
    id: 10,
    question: "2. SOULBOUND STAKING Introduction:",
    answer: (
      <>
        <ol className="list-decimal w-full pl-3 flex flex-col gap-1">
          <li className="font-semibold">Token Staking:</li>
          <ul className="list-disc pl-6">
            <li>
              Users can stake their $SBB tokens into a staking pool provided by
              the SoulBound Protocol.
            </li>
            <li>
              Staking involves locking a certain amount of $SBB tokens for a
              specified period, contributing to the network's security and
              stability.
            </li>
          </ul>
          <li className="font-semibold">Reward Distribution:</li>
          <ul className="list-disc pl-6">
            <li>
              Stakers receive rewards for their participation in the form of
              additional $SBB tokens or, uniquely, in the form of{" "}
              <strong>Bitcoin (BTC) rewards.</strong>
            </li>
            <li>
              The distribution of rewards is based on the number of tokens
              staked by each participant relative to the total tokens staked in
              the pool.
            </li>
          </ul>
          <li className="font-semibold">BTC Revenue Sharing:</li>
          <ul className="list-disc pl-6">
            <li>
              Unlike conventional staking mechanisms limited to token rewards,
              SoulBound offers an innovative approach. Stakers not only earn
              additional $SBB tokens but also receive BTC as a form of protocol
              fee revenue.
            </li>
            <li>
              The platform generates BTC revenue, and a portion of this revenue
              is distributed among participants staking $SBB tokens, aligning
              with the platform's revenue model.
            </li>
          </ul>
          <li className="font-semibold">Participation and Governance:</li>
          <ul className="list-disc pl-6">
            <li>
              Stakers actively contribute to the protocol by holding and
              securing $SBB tokens in the staking pool, potentially gaining
              governance rights to influence decisions within the SoulBound
              ecosystem.
            </li>
          </ul>
          <li className="font-semibold">Participation and Governance:</li>
          <ul className="list-disc pl-6">
            <li>
              The size and availability of staking pools may vary, allowing
              users to choose a pool based on their preferences or strategy.
            </li>
            <li>
              he staking pools' mechanisms and rules are usually defined by the
              protocol, including the duration of staking, reward distribution
              frequency, and the criteria for joining or exiting the pool.
            </li>
          </ul>
          <li className="font-semibold">BRC ARC Staking rewards in BTC</li>
        </ol>
      </>
    ),
  },
];

const faqs4 = [
  {
    id: 11,
    question:
      "1. What are the key milestones outlined in the SOULBOUND Protocol's roadmap for the coming 2 quarters?",
    answer: (
      <>
        The roadmap includes:
        <ul className="list-disc pl-6">
          <li>
            Development and implementation of DApp features, staking systems,
            and multi-wallet integration.
          </li>
          <li>
            Protocal Testnet & Mainnet launches on BNB Chain and BTC Layer 2s
          </li>
          <li>Community Building</li>
          <li>
            IDO launches for innovative projects covering all fields in BTC
            ecosystem (e.g., DeFi, RWA, RGB-focused projects).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 12,
    question: "2.  AIRDROP to Top Active User in SOULBOUND Protocol",
    answer: "",
  },
  {
    id: 13,
    question: "3. Governance Token $SBB LAUNCH.",
    answer: "",
  },
];
