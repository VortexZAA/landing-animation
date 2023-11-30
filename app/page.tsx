"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";
/* import { Logo } from "@/components/Icons/Icons";
import Text from "@/components/Text/Text";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import TeamCard from "@/components/TeamCard/TeamCard";
import ContactForm from "./_components/ContactForm";
import Header from "@/components/Header/Header";
import Link from "next/link";
import FirstPipes from "./_components/FirstPipes";
import SecondPipes from "./_components/SecondPipes";
import FirstPipesMobile from "./_components/FirstPipesMobile";
import SecondPipesMobile from "./_components/SecondPipesMobile";
import Spline from "@splinetool/react-spline";
import SwipeUpTutorial from "./_components/SwipeUpTutorial"; */
import Lottie from "lottie-react";
import loadingAnim from "@/assets/tree1.json";
import Header from "@/components/Header/Header";

gsap.registerPlugin(ScrollTrigger);

const frameCount = 239;

const currentFrame = (index: number) =>
  `forest/agac${(index + 1).toString().padStart(3, "0")}.jpg`;

const Home = () => {
  const sunRef = useRef<HTMLImageElement>(null);
  const animationsRef = useRef<GSAPTween[]>([]);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [counter, setCounter] = useState(0);
  const loadingPercentage = useMemo(
    () => Math.floor((counter / frameCount) * 100),
    [counter]
  );

  const getImages = useCallback(async () => {
    try {
      const newImages: HTMLImageElement[] = [];
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => setCounter((prev) => prev + 1);
        newImages.push(img);
      }

      setImages(newImages);
    } catch (err) {}
  }, []);

  const observeElement = useCallback(
    async (canvasRef: HTMLCanvasElement | null) => {
      if (!canvasRef) return;

      canvasRef.width = window.innerWidth;
      canvasRef.height = window.innerHeight;

      const context = canvasRef.getContext("2d");

      let ball = { frame: 0 };

      const render = () => {
        if (!context || !canvasRef) return;

        context.canvas.width = images[0].width;
        context.canvas.height = images[0].height;

        context.clearRect(0, 0, canvasRef.width, canvasRef.height);
        context.drawImage(images[ball.frame], 0, 0);
      };

      const anim1 = gsap.to(ball, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          scrub: 0.5,
          pin: "canvas",
          end: "380%",
        },
        onUpdate: render,
      });

      const anim2 = gsap.fromTo(
        ".zero-emission",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          scrollTrigger: {
            scrub: 0,

            start: "3%",
            end: "10%",
          },
          onComplete: () => {
            const anim4 = gsap.fromTo(
              ".zero-emission",
              {
                opacity: 1,
              },
              {
                opacity: 0,
                scrollTrigger: {
                  scrub: 0,

                  start: "10%",
                  end: "20%",
                },
              }
            );
            animationsRef.current.push(anim4);
          },
        }
      );

      const anim3 = gsap.fromTo(
        ".zero-waste",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          scrollTrigger: {
            scrub: 0,

            start: "22%",
            end: "32%",
          },
          onComplete: () => {
            const anim5 = gsap.fromTo(
              ".zero-waste",
              {
                opacity: 1,
              },
              {
                opacity: 0,
                scrollTrigger: {
                  scrub: 0,

                  start: "32%",
                  end: "40%",
                },
              }
            );
            animationsRef.current.push(anim5);
          },
        }
      );
      const anim4 = gsap.fromTo(
        ".pure-bitcoin",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          scrollTrigger: {
            scrub: 0,

            start: "42%",
            end: "52%",
          },
          onComplete: () => {
            const anim6 = gsap.fromTo(
              ".pure-bitcoin",
              {
                opacity: 1,
              },
              {
                opacity: 0,
                scrollTrigger: {
                  scrub: 0,

                  start: "52%",
                  end: "55%",
                },
              }
            );
            animationsRef.current.push(anim6);
          },
        }
      );
      const anim7 = gsap.fromTo(
        ".pure-grow",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          scrollTrigger: {
            scrub: 0,

            start: "60%",
            end: "65%",
          },
          onComplete: () => {
            const anim8 = gsap.fromTo(
              ".pure-grow",
              {
                opacity: 1,
              },
              {
                opacity: 0,
                scrollTrigger: {
                  scrub: 0,

                  start: "65%",
                  end: "70%",
                },
              }
            );
            animationsRef.current.push(anim8);
          },
        }
      );

      animationsRef.current.push(anim1, anim2, anim3, anim4, anim7);

      render();
    },
    [images]
  );

  
  useEffect(() => {
    getImages();
  }, [getImages]);

  useEffect(() => {
    return () => {
      animationsRef.current.forEach((anim) => anim.kill());
    };
  }, []);

  if (loadingPercentage < 100) {
    return (
      <div className="w-screen h-screen flex flex-col gap-6 items-center justify-center relative">
        <Lottie animationData={loadingAnim} loop className="sm:w-1/3 w-full" />
        <span className="text-3xl text-white font-bold absolute bottom-28 z-10">
          %{loadingPercentage}
        </span>
      </div>
    );
  }

  return (
    <>
      {/* <SwipeUpTutorial />*/}
      <Header />
      <div className='w-screen max-w-[100vw] flex flex-col'>
        <section className='relative mb-0 w-full'>
          <canvas className='w-full h-screen object-cover md:object-fill object-[calc(47%)]' ref={observeElement}></canvas>
          <span className='drop-shadow-2xl zero-emission sm:text-5xl text-2xl font-bold fixed top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white shrink-0 text-center w-full font-marcellus'>Innovation Through Equality</span>
          <span className='drop-shadow-2xl zero-waste sm:text-5xl text-2xl font-bold fixed top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white shrink-0 text-center w-full font-marcellus'>Opportunity for Everyone</span>
          <span className='drop-shadow-2xl pure-bitcoin sm:text-5xl text-2xl font-bold fixed top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 shrink-0 w-full text-center text-white font-marcellus'>Fairness in Every Step</span>
          <span className='drop-shadow-2xl pure-grow sm:text-5xl text-2xl font-bold fixed top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 shrink-0 w-full text-center text-white font-marcellus'>Grow Collectively</span>
          <div className='absolute bottom-0 left-0 w-screen h-screen'>
            <div className='relative w-full h-full'>
              <div className='end-logo absolute bottom-2/3 left-1/2 w-full -translate-x-1/2 flex flex-col items-center gap-12'>
                {/* <Logo className="sm:w-auto w-[250px] drop-shadow-2xl" /> */}
                <Link href='#' target='_blank'>
                  <span className=' shrink-0 h-fit border-0 border-white rounded-full text-white  px-8 py-3 font-bold transition-all duration-300 font-marcellus text-3xl md:text-6xl w-full'>FAWN PROTOCOL</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
