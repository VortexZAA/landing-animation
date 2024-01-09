import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";

export default function PartnersSlider() {
  return (
    <div className="flex flex-col text-white gap-0 items-center justify-center w-full h-fit  pb-3 ">
      <h3 className="text-base md:text-2xl">Partners</h3>
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        pagination={{
          clickable: true,
        }}
        className="!pb-8 -mb-8 max-h-[315px] md:!max-h-[365px] w-full px-3 md:px-6 "
        breakpoints={{
          0: {
            slidesPerView: 2.2,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 3.4,
            spaceBetween: 0,
          },
          1024: {
            slidesPerView: 4,
          },
          1438: {
            slidesPerView: 5,
          },
          1920: {
            slidesPerView: 6,
          },
        }}
        speed={700}
        autoplay={{
          delay: 2000,
          disableOnInteraction: true,
        }}
        modules={[Autoplay]}
      >
        {partners.map((item) => (
          <SwiperSlide
            key={item.id}
            className="flex justify-center items-center  w-full h-16  px-2 md:px-6 mb-1 md:mb-0 md:p-3 "
          >
            <Link href={item.link} className="flex justify-center bg-white/10 rounded-lg py-2 backdrop-blur-md items-center w-full h-12 md:h-16" target="_blank" rel="noreferrer">
              <img
                src={item.logo}
                alt={item.name}
                className="w-fit h-4/5 object-contain "
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
const partners = [
  {
    //binance
    id: 1,
    name: "Binance",
    logo: "/images/partners/bnb.png",
    link: "https://binance.com",
  },
  {
    //Bevm
    id: 2,
    name: "Bevm",
    logo: "/images/partners/bevm.svg",
    link: "https://bevm.io",
  },
  {
    //delta labs
    id: 3,
    name: "Delta Labs",
    logo: "/images/partners/delta.png",
    link: "https://deltalabs.pro",
  },
  {
    //Ave
    id: 4,
    name: "Ave",
    logo: "/images/partners/ave.png",
    link: "https://twitter.com/aveaiofficial",
  },
  {
    //blockbridge digital
    id: 5,
    name: "Blockbridge Digital",
    logo: "/images/partners/blockbridge.png",
    link: "https://blockbridge.xyz/",
  },
  {
    //bitget wallet
    id: 6,
    name: "Bitget Wallet",
    logo: "/images/partners/bitget.png",
    link: "https://bitget.com",
  },
  //pyth
  {
    id: 7,
    name: "Pyth",
    logo: "/images/partners/pyth.svg",
    link: "https://pyth.network",
  },
  //subquery
  {
    id: 8,
    name: "SubQuery",
    logo: "/images/partners/subquery.svg",
    link: "https://subquery.network",
  },
  //aeroscrapper
  {
    id: 9,
    name: "Aeroscrapper",
    logo: "/images/partners/aeroscrapper.svg",
    link: "https://twitter.com/aeroscraper",
  },
  //nova-ratio
  {
    id: 10,
    name: "Nova Ratio",
    logo: "/images/partners/nova-ratio.svg",
    link: "https://novaratio.io/",
  },
];
