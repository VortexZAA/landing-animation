"use client"

import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Logo2 } from '../Icons/Icons';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { AnimatePresence, motion } from 'framer-motion'

const Header: FC = () => {
    const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [showBg, setShowBg] = useState(false);
    const prevScrollY = useRef<number>(0);

    const closeHeader = useCallback(() => {
        setHeaderMenuOpen(false);
    }, [])

    const handleScroll = useCallback(() => {
        if (prevScrollY.current < window.scrollY) {
            setShowHeader(false);
        }
        else {
            setShowHeader(true);
        }
        setShowBg(window.scrollY >= 40)
        prevScrollY.current = window.scrollY;
    }, [])

    const toggleMenu = useCallback(() => {
        setHeaderMenuOpen(prev => !prev);
    }, [])

    useEffect(() => {
        document.addEventListener('scroll', handleScroll);
        return () => document.removeEventListener('scroll', handleScroll);
    }, [])

    return (
        <>
            {<div className={twMerge(
                'fixed h-[87px] w-[100vw] top-0 left-0 bg-opacity-30 z-[1000] transition-all rounded-b-[20px] sm:px-2 sm:py-0 py-6 px-4',
                showHeader ? 'translate-y-0' : '-translate-y-full',
                showBg ? 'bg-[#00312E] backdrop-blur' : 'bg-transparent backdrop-blur-0',
                headerMenuOpen ? 'hidden md:block' : 'block'
            )}>
                <div className='h-full mx-auto container flex justify-between items-center px-3'>
                    {/* <div className='lg:block hidden'>
                        <Logo2 width='90' height='66' />
                    </div>
                    <div className='lg:hidden md:block hidden'>
                        <Logo2 width='75' height='55' />
                    </div>
                    <div className='md:hidden block'>
                        <Logo2 width='60' height='44' />
                    </div> */}
                    <div className='w-40'>

                    </div>
                    <div className='sm:flex hidden items-center lg:gap-11 md:gap-6 gap-4'>
                        <Link href='#who' className='text-white lg:text-base md:text-xs text-[11px] font-medium font-satoshi hover:text-opacity-60 transition-all'>
                            Who Are We
                        </Link>
                        <Link href='#about' className='text-white lg:text-base md:text-xs text-[11px] font-medium font-satoshi hover:text-opacity-60 transition-all'>
                            About
                        </Link>
                        <Link href='#products' className='text-white lg:text-base md:text-xs text-[11px] font-medium font-satoshi hover:text-opacity-60 transition-all'>
                            Products
                        </Link>
                        <Link href='#participate' className='text-white lg:text-base md:text-xs text-[11px] font-medium font-satoshi hover:text-opacity-60 transition-all'>
                            Participate
                        </Link>
                        <Link href='#road-map' className='text-white lg:text-base md:text-xs text-[11px] font-medium font-satoshi hover:text-opacity-60 transition-all'>
                            Road Map
                        </Link>
                        <Link href='#team' className='text-white lg:text-base md:text-xs text-[11px] font-medium font-satoshi hover:text-opacity-60 transition-all'>
                            Team
                        </Link>
                        <Link href='#contact-us' className='text-white lg:text-base md:text-xs text-[11px] font-medium font-satoshi hover:text-opacity-60 transition-all'>
                            Contact
                        </Link>
                    </div>
                    <Link href='#' target='_blank' className='sm:block hidden'>
                        <button className='w-fit h-fit border border-white rounded-full text-white lg:text-base md:text-xs text-[11px] lg:px-8 px-4 py-2 font-bold hover:bg-white hover:text-black transition-all duration-300'>
                            LITEPAPER
                        </button>
                    </Link>
                    <button className='sm:hidden flex flex-col gap-[2px] p-4 active:scale-95 transition-all' onClick={toggleMenu}>
                        <span className='w-5 h-[2px] bg-white' />
                        <span className='w-5 h-[2px] bg-white' />
                        <span className='w-5 h-[2px] bg-white' />
                    </button>
                </div>
            </div>}
            <AnimatePresence>
                {
                    headerMenuOpen && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: '100vh' }}
                            exit={{ height: 0 }}
                            className='sm:hidden flex flex-col items-center justify-center gap-10 fixed inset-0 w-screen bg-sacramento-green z-[999] overflow-hidden'
                        >
                            <Link onClick={closeHeader} href='#who' className='text-white text-2xl font-medium font-satoshi hover:text-opacity-60 transition-all'>
                                Who Are We
                            </Link>
                            <Link onClick={closeHeader} href='#about' className='text-white text-2xl font-medium font-satoshi hover:text-opacity-60 transition-all'>
                                About
                            </Link>
                            <Link onClick={closeHeader} href='#products' className='text-white text-2xl font-medium font-satoshi hover:text-opacity-60 transition-all'>
                                Products
                            </Link>
                            <Link onClick={closeHeader} href='#participate' className='text-white text-2xl font-medium font-satoshi hover:text-opacity-60 transition-all'>
                                Participate
                            </Link>
                            <Link onClick={closeHeader} href='#road-map' className='text-white text-2xl font-medium font-satoshi hover:text-opacity-60 transition-all'>
                                Road Map
                            </Link>
                            <Link onClick={closeHeader} href='#team' className='text-white text-2xl font-medium font-satoshi hover:text-opacity-60 transition-all'>
                                Team
                            </Link>
                            <Link onClick={closeHeader} href='#contact-us' className='text-white text-2xl font-medium font-satoshi hover:text-opacity-60 transition-all'>
                                Contact
                            </Link>
                            <Link onClick={closeHeader} href='#' target='_blank'>
                                <button className='w-fit h-fit border border-white rounded-full text-white text-lg px-20 py-2 font-bold hover:bg-white hover:text-black transition-all duration-300'>
                                    LITEPAPER
                                </button>
                            </Link>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </>
    )
}

export default Header