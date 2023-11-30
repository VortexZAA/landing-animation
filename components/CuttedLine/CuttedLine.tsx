import React, { FC } from 'react'
import { twMerge } from 'tailwind-merge';

type Props = {
    className?: string;
    orientation?: 'vertical' | 'horizontal';
    topDot?: boolean;
    bottomDot?: boolean;
    leftDot?: boolean;
    rightDot?: boolean;
}

const CuttedLine: FC<Props> = ({ className, orientation = 'horizontal', topDot, bottomDot, leftDot, rightDot }) => {
    return (
        <div className={twMerge('relative shrink-0', className)}>
            <div
                className={
                    twMerge(
                        orientation === 'horizontal' ? 'w-full h-[2px] horizontal-dashed-line' : 'w-[2px] h-full vertical-dashed-line'
                    )
                }
            />
            {
                topDot && <div className={twMerge('absolute w-[10px] h-[10px] rounded-full bg-sacramento-green top-0 left-1/2 -translate-y-1/2 -translate-x-1/2')} />
            }
            {
                bottomDot && <div className={twMerge('absolute w-[10px] h-[10px] rounded-full bg-sacramento-green bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2')} />
            }
            {
                leftDot && <div className={twMerge('absolute w-[10px] h-[10px] rounded-full bg-sacramento-green top-1/2 left-0 -translate-y-1/2 -translate-x-1/2')} />
            }
            {
                rightDot && <div className={twMerge('absolute w-[10px] h-[10px] rounded-full bg-sacramento-green top-1/2 right-0 -translate-y-1/2 translate-x-1/2')} />
            }
        </div>
    )
}

export default CuttedLine