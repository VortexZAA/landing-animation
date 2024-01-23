import Image from "next/image";
import { useState } from "react";
import Layout from "@/layout/layout";


import AnimateHeight from "react-animate-height";
import { arrow } from "@/components/icons/arrow";
import { faqs0 } from "@/data/faq/faq0";
import { faqs1 } from "@/data/faq/faq1";
import { faqs2 } from "@/data/faq/faq2";
import { faqs3 } from "@/data/faq/faq3";
import { faqs4 } from "@/data/faq/faq4";

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
        <div className="flex flex-col gap-12  h-[76vh] w-full justify-start items-center backdrop-blur-sm bg-white/10 rounded-xl shadow-md overflow-auto py-6">
          <div
            id="faq"
            className="flex flex-col gap-6 xl:gap-10 items-center  w-full"
          >
            {/*             <h1>FAQ</h1> */}
            <div className="mb-5 flex flex-col gap-3 md:gap-6 w-full items-center justify-start">
              <h2 className="text-white text-xl w-2/3">
                Questions about Airdrop&Badges and IDO:
              </h2>
              <div className="flex flex-col gap-3 font-semibold w-full lg:w-2/3">
                {faqs0.map((faq) => (
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
