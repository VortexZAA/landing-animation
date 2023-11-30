import React, { FC } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = React.InputHTMLAttributes<HTMLTextAreaElement>

const TextArea: FC<Props> = ({ className, ...restProps }) => {
    return (
        <textarea
            {...restProps}
            className={
                twMerge(
                    'focus:outline-none outline-none bg-transparent border-b-2 border-sacramento-green border-opacity-30 focus:border-opacity-100 transition-all placeholder:text-sonic-silver text-sacramento-green font-satoshi text-base py-2 resize-none',
                    className
                )
            }
        />
    )
}

export default TextArea