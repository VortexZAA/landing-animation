import React, { useEffect, useRef, useState } from 'react'

const TOTAL_ELEMENT = 10;
const DURATION = 500;

const FirstPipesMobile = () => {
    const intervalRef = useRef<NodeJS.Timer | number | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % TOTAL_ELEMENT)
        }, DURATION)

        return () => {
            clearInterval(intervalRef.current as number)
        }
    }, [])

    return (
        <div className="relative flex items-center gap-2 w-fit h-[25px] mx-auto scale-[.65]">
            <div className="absolute top-0 -left-2 flex flex-col gap-2 -translate-x-full">
                <img alt="line" src='line-4.png' className={`${activeIndex === 7 ? 'opacity-100' : 'opacity-50'} bg-opacity-60 w-fit h-fit  transition-all duration-500`} />
                <img alt="line" src='line-2.png' className={`${activeIndex === 8 ? 'opacity-100' : 'opacity-50'} bg-opacity-60 w-[25px] h-[100px] transition-all duration-500`} />
                <img alt="circle" src='circle-1.png' className={`${activeIndex === 9 ? 'opacity-100' : 'opacity-50'} bg-opacity-60 w-fit h-fit transition-all duration-500`} />
            </div>
            <img alt="line" src="line-1.png" className={`${activeIndex === 6 ? 'opacity-100' : 'opacity-50'} bg-opacity-60 w-[22vw] h-[25px] transition-all duration-500`} />
            <img alt="line" src="line-1.png" className={`${activeIndex === 5 ? 'opacity-100' : 'opacity-50'} bg-opacity-60 w-[22vw] h-[25px] transition-all duration-500`} />
            <img alt="line" src="line-1.png" className={`${activeIndex === 4 ? 'opacity-100' : 'opacity-50'} bg-opacity-60 w-[22vw] h-[25px] transition-all duration-500`} />
            <img alt="line" src="line-1.png" className={`${activeIndex === 3 ? 'opacity-100' : 'opacity-50'} bg-opacity-60 w-[22vw] h-[25px] transition-all duration-500`} />
            <div className="absolute bottom-0 -right-2 flex flex-col items-end gap-2 translate-x-full">
                <img alt="circle" src='circle-1.png' className={`${activeIndex === 0 ? 'opacity-100' : 'opacity-50'} bg-opacity-60 w-fit h-fit transition-all duration-500`} />
                <img alt="line" src='line-2.png' className={`${activeIndex === 1 ? 'opacity-100' : 'opacity-50'} bg-opacity-60 w-[25px] h-[100px] transition-all duration-500`} />
                <img alt="line" src='line-3.png' className={`${activeIndex === 2 ? 'opacity-100' : 'opacity-50'} bg-opacity-60 w-fit h-fit transition-all duration-500`} />
            </div>
        </div>
    )
}

export default FirstPipesMobile