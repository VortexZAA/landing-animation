import React, { FC } from 'react'
import Text from '../Text/Text'

type Props = {
    title: string;
    lineDisabled?: boolean;
}

const SectionTitle: FC<Props> = ({ title, lineDisabled }) => {
    return (
        <div className='flex sm:gap-20 gap-4 items-center z-50'>
            <Text variant='4xl' font='font-spring' className='uppercase font-semibold'>{title}</Text>
            {!lineDisabled && <div className='flex-1 h-[2px] bg-sacramento-green' />}
        </div>
    )
}

export default SectionTitle