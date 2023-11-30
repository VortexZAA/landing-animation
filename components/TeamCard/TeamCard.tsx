import React, { FC } from 'react'
import Text from '../Text/Text';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { LinkedIn } from '../Icons/Icons';

type Props = {
    avatarUrl: string;
    fullname: string;
    title: string;
    className?: string;
    linkedinUrl: string;
}

const TeamCard: FC<Props> = ({ avatarUrl, fullname, title, className, linkedinUrl }) => {
    return (
        <div className={twMerge('lg:max-w-[295px] w-full xl:h-[406px] sm:h-[320px] h-[250px] flex flex-col items-center xl:pt-14 pt-8 pb-4 px-4 bg-white bg-opacity-50 lg:rounded-[50px] rounded-3xl shadow mx-auto', className)}>
            <div className='xl:w-[177px] xl:h-[177px] sm:w-[120px] sm:h-[120px] w-[75px] h-[75px] rounded-full bg-medium-aquamarine flex items-end overflow-hidden'>
                <img alt={fullname} src={avatarUrl} className='z-30' />
            </div>
            <Text variant='lg' className='mt-6 text-center' font='font-spring'>{fullname}</Text>
            <Text variant='sm' className='mt-4 text-center' color='text-spanish-gray' font='font-satoshi'>{title}</Text>
            <a target='_blank' href={linkedinUrl} className='mt-auto'>
                <LinkedIn />
            </a>
        </div>
    )
}

export default TeamCard