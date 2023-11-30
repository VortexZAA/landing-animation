"use client"

import React, { FC, PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

const TextVariants = {
    "9px": "xl:text-[9px] md:text-[7px] sm:text-[5px] text-[4px]",
    "10px": "xl:text-[10px] md:text-[8px] sm:text-[6px] text-[5px]",
    "11px": "xl:text-[11px] md:text-[9px] sm:text-[7px] text-[6px]",
    "xs": "xl:text-xs md:text-[10px] sm:text-[8px] text-[7px]",
    "13px": "xl:text-[13px] md:text-[11px] sm:text-[9px] text-[8px]",
    "sm": "xl:text-sm md:text-xs sm:text-[10px] text-[9px]",
    "base": "xl:text-base md:text-[13px] sm:text-[11px] text-[10px]",
    "lg": "xl:text-lg md:text-sm sm:text-xs text-[11px]",
    "xl": "xl:text-xl md:text-base sm:text-[13px] text-xs",
    "2xl": "xl:text-2xl md:text-lg sm:text-sm text-[13px]",
    "2xl-mobile": "xl:text-2xl md:text-lg sm:text-sm text-[11px]",
    "3xl": "xl:text-3xl md:text-xl sm:text-base text-sm",
    "4xl": "xl:text-4xl md:text-2xl sm:text-xl text-lg",
    "5xl": "xl:text-5xl md:text-3xl sm:text-2xl text-xl",
    "6xl": "xl:text-6xl md:text-4xl sm:text-3xl text-2xl",
    "7xl": "xl:text-7xl md:text-5xl sm:text-4xl text-3xl",
    "8xl": "xl:text-8xl md:text-6xl sm:text-5xl text-4xl",
    "9xl": "xl:text-9xl md:text-7xl sm:text-6xl text-5xl"
}

export type TextProps = {
    className?: string;
    color?: string;
    variant?: keyof typeof TextVariants;
    font?: 'font-marcellus' | 'font-nunito' | 'font-spring' | 'font-satoshi'
}

const Text: FC<PropsWithChildren<TextProps>> = ({
    children,
    className,
    variant = "base",
    color = "text-sacramento-green",
    font = 'font-satoshi'
}) => {
    return (
        <span
            className={
                twMerge(
                    color,
                    TextVariants[variant],
                    font,
                    className
                )
            }
        >
            {children}
        </span>
    )
}

export default Text