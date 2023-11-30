"use client"

import React, { FC, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from '@/components/Icons/Icons';

const IS_SCROLL_TUTORIAL_SHOWN_KEY = 'scroll-tutorial';

const SwipeUpTutorial: FC = () => {
    const [show, setShow] = React.useState(false);

    useEffect(() => {
        const isShown = localStorage.getItem(IS_SCROLL_TUTORIAL_SHOWN_KEY) === 'true';
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setShow(false);
                localStorage.setItem(IS_SCROLL_TUTORIAL_SHOWN_KEY, 'true');
                window.removeEventListener('scroll', handleScroll);
            }
        }

        if (!isShown) {
            setShow(true);
            window.addEventListener('scroll', handleScroll)
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    return (
        <AnimatePresence>
            {
                show &&
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='sm:hidden fixed inset-0 flex flex-col gap-4 justify-end items-center bg-black bg-opacity-60 z-[10000] pb-10'
                >
                    <div className='w-[39px] h-[74px] rounded-full border-[3px] border-white flex items-center justify-center'>
                        <ArrowUp className='animate-[swipeUp_ease-in-out_1s_infinite]' />
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    )
}

export default SwipeUpTutorial