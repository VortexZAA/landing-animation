'use client';
import Vip from '@/components/vip';
import React, { useState } from 'react';
import Layout from '@/app/layout/layout';
import { callRegister, callApprove, callAllowance, checkAllowance, callGetPrice, parseIntHex } from '@/contractInteractions/useAppContract';
import Ethers from '@/lib/ethers';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import { Alert } from '@/components/alert/alert';
import { ToastError, ToastSuccess } from '@/components/alert/SweatAlert';
import Loading from '@/components/loading';
import { useAppDispatch, useAppSelector } from '@/hook/redux/hooks';
import { selectData, setLoading } from '@/redux/auth/auth';
import { useRouter } from 'next/navigation'
import Image from 'next/image';

export default function NftBuy() {
  function parseTo18Decimals(number: number) {
    try {
      const parsed = ethers.utils.parseUnits(number.toString(), 18);
      return parsed.toString();
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  const [uInput1, setuInput1] = useState('');
  const [uInput2, setuInput2] = useState('');
  const [uInput3, setuInput3] = useState('');
  const [alert, setAlert]: any = useState(null);
  const [price, setPrice]: any = useState({
    vip1: 250,
    vip2: 500,
    vip3: 1000,
  });
  const { loading, address } = useAppSelector(selectData);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function buyVip1() {
    try {
      dispatch(setLoading(true));
      console.log([uInput1, 1]);
      const tempInput1 = uInput1 as unknown;
      const numberInput1 = tempInput1 as number;
      let allowance = await checkAllowance(250);
      if (allowance) {
        const tx: any = await callRegister(numberInput1, 1, address);
        tx &&
          ToastSuccess({
            tHashLink: tx.hash,
          }).fire({
            title: 'Transaction Successful',
          });
        router.push('/dashboard');
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      ToastError.fire({
        title: 'Transaction Failed',
      });
      dispatch(setLoading(false));
    }
  }
  const refVip1 = (event: any) => {
    setuInput1(event.target.value);
  };

  async function buyVip2() {
    try {
      dispatch(setLoading(true));
      console.log([uInput2, 2]);
      const tempInput2 = uInput2 as unknown;
      const numberInput2 = tempInput2 as number;
      let allowance = await checkAllowance(500);
      if (allowance) {
        const tx: any = await callRegister(numberInput2, 2, address);
        tx &&
          ToastSuccess({
            tHashLink: tx.hash,
          }).fire({
            title: 'Transaction Successful',
          });
        router.push('/dashboard');
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      ToastError.fire({
        title: 'Transaction Failed',
      });
      dispatch(setLoading(false));
    }
  }
  const refVip2 = (event: any) => {
    setuInput2(event.target.value);
  };

  async function buyVip3() {
    try {
      dispatch(setLoading(true));
      console.log([uInput3, 3]);
      const tempInput3 = uInput3 as unknown;
      const numberInput3 = tempInput3 as number;
      let allowance = await checkAllowance(1000);
      if (allowance) {
        const tx: any = await callRegister(numberInput3, 3, address);
        tx &&
          ToastSuccess({
            tHashLink: tx.hash,
          }).fire({
            title: 'Transaction Successful',
          });
        router.push('/dashboard');
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      ToastError.fire({
        title: 'Transaction Failed',
      });
      dispatch(setLoading(false));
    }
  }
  const refVip3 = (event: any) => {
    setuInput3(event.target.value);
  };

  return (
    <>
      {alert?.show && <Alert status={alert?.status} text={alert?.text} tHashLink={alert?.tHashLink} />}

      <Layout title='NFT Buy'>
        <div className='flex w-full justify-center items-center xl:h-[85vh] text-white'>
          <div className='items-center justify-center w-full grid md:grid-cols-2 lg:grid-cols-3 h-full lg:h-2/3 gap-3 md:gap-4 xl:gap-6'>
            <div className='backdrop-blur-sm bg-cardBg border-cardBorder border-[3px] rounded-xl shadow-md w-full gap-10 h-full p-6 flex flex-col justify-between'>
              
              <Image src={'/assets/cards/1.png'} width={500} height={500} quality={100} className=' absolute h-1/2 w-fit -top-8 -left-6'  alt='' />
              <Image src={'/assets/cards/2.png'} width={500} height={500} quality={100} className=' absolute h-1/2 w-fit -bottom-8 -right-6'  alt='' />
              <Vip text='Seed 1' />
              <div className='flex  justify-center items-center gap-3 border-2 p-6 border-vip1 rounded-md'>
                <svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M27.5781 3.79688C27.5156 3.8125 25.1563 4.21094 22.3438 4.6875C9.92969 6.79688 6.33594 7.42188 5.97656 7.53906C5.23438 7.78906 4.65625 8.15625 4.05469 8.75C3.57031 9.22656 3.39063 9.46875 3.10156 10.0781C2.4375 11.4531 2.46875 10.8984 2.46094 21.4062C2.46094 30.0078 2.46875 30.7031 2.60156 31.1719C2.82031 32.0078 3.24219 32.7734 3.80469 33.3594C4.44531 34.0469 5.01563 34.4219 5.85938 34.7188L6.52344 34.9609H19.9609H33.3984L34.0625 34.7188C34.9141 34.4141 35.4922 34.0312 36.1328 33.3438C36.6875 32.7422 37.1016 31.9922 37.3203 31.1719C37.4531 30.7031 37.4609 30.0469 37.4609 22.5C37.4609 14.9531 37.4531 14.2969 37.3203 13.8281C36.8672 12.1484 35.625 10.7969 34.0234 10.25L33.3984 10.0391L22.7344 10C14.8672 9.96875 12.0313 9.9375 11.9141 9.86719C11.4609 9.60938 11.2891 9.05469 11.5156 8.60938C11.7813 8.08594 11.0156 8.125 22.6953 8.14062L33.2813 8.16406V7.96094C33.2813 7.85156 33.2109 7.5625 33.125 7.3125C32.8438 6.49219 32.4844 5.92188 31.8359 5.27344C31.1016 4.53125 30.2578 4.07031 29.2813 3.875C28.7422 3.76562 27.8906 3.72656 27.5781 3.79688ZM29.8125 20.2422C30.2969 20.4766 30.7734 20.9453 31.0156 21.4453C31.1641 21.7656 31.2031 21.9609 31.2031 22.5C31.2109 23.1094 31.1875 23.2031 30.9453 23.6562C30.6563 24.1953 30.3203 24.5078 29.7656 24.7812C29.25 25.0312 28.2344 25.0234 27.6953 24.7656C25.6641 23.7812 25.8359 20.9062 27.9688 20.125C28.4531 19.9531 29.2969 20.0078 29.8125 20.2422Z'
                    fill='currentColor'
                  />
                </svg>
                Wallet
              </div>
              <div className='w-full  flex flex-col gap-3 z-10'>
                <input type='text' onChange={refVip1} placeholder='Referral Code' className='outline-none border-2 rounded-lg border-gray-200 p-3 text-black' />
                <button type='submit' disabled={loading} onClick={buyVip1} className='bg-purple hover:opacity-95 text-white rounded-lg py-3 disabled:opacity-70 disabled:cursor-not-allowed gap-3 w-full flex justify-center items-center'>
                  Buy {loading && <Loading />}
                </button>
              </div>
            </div>
            <div className='backdrop-blur-sm bg-cardBg border-cardBorder border-[3px] rounded-xl shadow-md w-full gap-6 h-full p-6 flex flex-col justify-between'>
              <Image src={'/assets/cards/3.png'} width={500} height={500}  className=' absolute h-fit w-full -top-8 -left-0'  alt='' />
              <Image src={'/assets/cards/3.1.png'} width={500} height={500}  className=' absolute h-fit w-full -bottom-[15%] -left-0'  alt='' />
              <Vip text='Seed 2' />
              <div className='flex  justify-center items-center gap-3 border-2 p-6 border-vip2 rounded-md'>
                <svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M27.5781 3.79688C27.5156 3.8125 25.1563 4.21094 22.3438 4.6875C9.92969 6.79688 6.33594 7.42188 5.97656 7.53906C5.23438 7.78906 4.65625 8.15625 4.05469 8.75C3.57031 9.22656 3.39063 9.46875 3.10156 10.0781C2.4375 11.4531 2.46875 10.8984 2.46094 21.4062C2.46094 30.0078 2.46875 30.7031 2.60156 31.1719C2.82031 32.0078 3.24219 32.7734 3.80469 33.3594C4.44531 34.0469 5.01563 34.4219 5.85938 34.7188L6.52344 34.9609H19.9609H33.3984L34.0625 34.7188C34.9141 34.4141 35.4922 34.0312 36.1328 33.3438C36.6875 32.7422 37.1016 31.9922 37.3203 31.1719C37.4531 30.7031 37.4609 30.0469 37.4609 22.5C37.4609 14.9531 37.4531 14.2969 37.3203 13.8281C36.8672 12.1484 35.625 10.7969 34.0234 10.25L33.3984 10.0391L22.7344 10C14.8672 9.96875 12.0313 9.9375 11.9141 9.86719C11.4609 9.60938 11.2891 9.05469 11.5156 8.60938C11.7813 8.08594 11.0156 8.125 22.6953 8.14062L33.2813 8.16406V7.96094C33.2813 7.85156 33.2109 7.5625 33.125 7.3125C32.8438 6.49219 32.4844 5.92188 31.8359 5.27344C31.1016 4.53125 30.2578 4.07031 29.2813 3.875C28.7422 3.76562 27.8906 3.72656 27.5781 3.79688ZM29.8125 20.2422C30.2969 20.4766 30.7734 20.9453 31.0156 21.4453C31.1641 21.7656 31.2031 21.9609 31.2031 22.5C31.2109 23.1094 31.1875 23.2031 30.9453 23.6562C30.6563 24.1953 30.3203 24.5078 29.7656 24.7812C29.25 25.0312 28.2344 25.0234 27.6953 24.7656C25.6641 23.7812 25.8359 20.9062 27.9688 20.125C28.4531 19.9531 29.2969 20.0078 29.8125 20.2422Z'
                    fill='currentColor'
                  />
                </svg>
                Wallet
              </div>
              <div className='w-full  flex flex-col gap-3 z-10'>
                <input type='text' onChange={refVip2} placeholder='Referral Code' className='outline-none border-2 rounded-lg border-gray-200 p-3 text-black' />
                <button type='submit' disabled={loading} onClick={buyVip2} className='bg-purple hover:opacity-95 text-white rounded-lg py-3 disabled:opacity-70 disabled:cursor-not-allowed w-full gap-3 flex justify-center items-center'>
                  Buy {loading && <Loading />}
                </button>
              </div>
            </div>
            <div className='backdrop-blur-sm bg-cardBg border-cardBorder border-[3px] rounded-xl shadow-md w-full gap-6 h-full p-6 flex flex-col justify-between'>
              <Image src={'/assets/cards/5.png'} width={500} height={500}  className=' absolute h-full w-fit -right-6 -top-6' alt='' />
              <Vip text='Seed 3' />
              <div className='flex justify-center items-center  gap-3 border-2 p-6 border-vip3 rounded-md'>
                <svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M27.5781 3.79688C27.5156 3.8125 25.1563 4.21094 22.3438 4.6875C9.92969 6.79688 6.33594 7.42188 5.97656 7.53906C5.23438 7.78906 4.65625 8.15625 4.05469 8.75C3.57031 9.22656 3.39063 9.46875 3.10156 10.0781C2.4375 11.4531 2.46875 10.8984 2.46094 21.4062C2.46094 30.0078 2.46875 30.7031 2.60156 31.1719C2.82031 32.0078 3.24219 32.7734 3.80469 33.3594C4.44531 34.0469 5.01563 34.4219 5.85938 34.7188L6.52344 34.9609H19.9609H33.3984L34.0625 34.7188C34.9141 34.4141 35.4922 34.0312 36.1328 33.3438C36.6875 32.7422 37.1016 31.9922 37.3203 31.1719C37.4531 30.7031 37.4609 30.0469 37.4609 22.5C37.4609 14.9531 37.4531 14.2969 37.3203 13.8281C36.8672 12.1484 35.625 10.7969 34.0234 10.25L33.3984 10.0391L22.7344 10C14.8672 9.96875 12.0313 9.9375 11.9141 9.86719C11.4609 9.60938 11.2891 9.05469 11.5156 8.60938C11.7813 8.08594 11.0156 8.125 22.6953 8.14062L33.2813 8.16406V7.96094C33.2813 7.85156 33.2109 7.5625 33.125 7.3125C32.8438 6.49219 32.4844 5.92188 31.8359 5.27344C31.1016 4.53125 30.2578 4.07031 29.2813 3.875C28.7422 3.76562 27.8906 3.72656 27.5781 3.79688ZM29.8125 20.2422C30.2969 20.4766 30.7734 20.9453 31.0156 21.4453C31.1641 21.7656 31.2031 21.9609 31.2031 22.5C31.2109 23.1094 31.1875 23.2031 30.9453 23.6562C30.6563 24.1953 30.3203 24.5078 29.7656 24.7812C29.25 25.0312 28.2344 25.0234 27.6953 24.7656C25.6641 23.7812 25.8359 20.9062 27.9688 20.125C28.4531 19.9531 29.2969 20.0078 29.8125 20.2422Z'
                    fill='currentColor'
                  />
                </svg>
                Wallet
              </div>
              <div className='w-full  flex flex-col gap-3 z-10'>
                <input type='text' onChange={refVip3} placeholder='Referral Code' className='outline-none border-2 rounded-lg border-gray-200 p-3 text-black' />
                <button type='submit' disabled={loading} onClick={buyVip3} className='bg-purple hover:opacity-95 text-white rounded-lg py-3 disabled:opacity-70 disabled:cursor-not-allowed w-full gap-3 flex justify-center items-center'>
                  Buy {loading && <Loading />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
