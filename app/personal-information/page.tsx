'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/app/layout/layout';
import CopyBtn from '@/components/button/copyBtn';
import { callWithdraw, callUpgrade, checkAllowance, callBuyNFT, callListNFT, claimReferralReward, callApproveNFT, callApproveNFT2, callGetReferralCodeForLeft, callGetReferralCodeForRight, callListings, callCancelListing, callgetAllListedNFTs, parseIntHex } from '@/contractInteractions/useAppContract';
import Vip from '@/components/vip';
import { ethers } from 'ethers';
import { useAppDispatch, useAppSelector } from '@/hook/redux/hooks';
import { selectData, setAddress, setLoading } from '@/redux/auth/auth';
import { ToastError, ToastSuccess } from '@/components/alert/SweatAlert';
import Loading from '@/components/loading';
import Modal from '@/components/Modal';
import LvlRatio from '@/hook/lvlratio';
import { parseTo18Decimals } from '@/hook/parse18decimals';
import Image from 'next/image';

export default function Personel() {
  const [withdrawNum, setwithdrawNum] = useState('');

  const [refCode, setrefCode] = useState({
    left: '',
    right: '',
  });
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const reduxData = useAppSelector(selectData);
  const { withdrawableBalance, totalRevenue, vipLvl, address, loading, nftId, downlines, referralIncome, lvl, lowPotentiel } = reduxData;

  const dispatch = useAppDispatch();

  useEffect(() => {
    const addres = localStorage.getItem('address');
    addres && dispatch(setAddress(addres));
    checkListing();
  }, []);

  async function getReferralCodeLeft(address?: string) {
    try {
      dispatch(setLoading(true));
      const addres = localStorage.getItem('address') || '';
      if (addres) {
        let reffCode = await callGetReferralCodeForLeft(addres);
        let reff = reffCode.toString();
        console.log(reff);
        setrefCode({
          left: reff,
          right: refCode.right,
        });
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
    }
  }
  async function getReferralCodeRight(address?: string) {
    try {
      dispatch(setLoading(true));
      const addres = localStorage.getItem('address') || '';
      if (addres) {
        let reffCode = await callGetReferralCodeForRight(addres);
        let reff = reffCode.toString();
        console.log(reff);
        setrefCode({
          left: refCode.left,
          right: reff,
        });
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const tempWithdraw = withdrawNum as unknown;
      const numberWithdraw = tempWithdraw as number;
      console.log(numberWithdraw);
      const withdraw18: any = parseTo18Decimals(numberWithdraw);
      const res: any = await callWithdraw();
      console.log(res);
      if (res) {
        ToastSuccess({ tHashLink: res.hash }).fire({
          title: 'Transaction Successful',
        });
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      ToastError.fire({
        title: 'Something went wrong',
      });
      dispatch(setLoading(false));
    }
  }

  const withdrawNumber = (event: any) => {
    setwithdrawNum(event.target.value);
  };

  async function upVipLvl(e: any) {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const tempLvl = vipLvl as unknown;
      const upLvl = Number(e.target.upLvl.value) as number;
      console.log(upLvl);
      let allowance = await checkAllowance(2 === upLvl ? 500 : 1000);
      console.log(allowance);

      if (allowance) {
        let res = await callUpgrade(upLvl);
        res &&
          ToastSuccess({
            tHashLink: res.hash,
          }).fire('Wallet Upgrade Successfully');
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
    }
  }

  async function listingNft(e: any) {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const price = e.target.price.value;
      let aprove = await callApproveNFT();
      if (nftId && price && aprove) {
        //price değerini 18 decimala çevir
        /* let price18 = parseTo18Decimals(Number(price));
        console.log(price18); */

        let res = await callListNFT(nftId, ethers.utils.parseUnits(price, 18), address);
        console.log(res);
        res &&
          ToastSuccess({
            tHashLink: res.hash,
          }).fire('NFT Listing Successfully');
      }
      dispatch(setLoading(false));
      checkListing();
      setModal(false);
    } catch (error) {
      console.log(error);
      ToastError.fire({
        title: 'Something went wrong',
      });
      dispatch(setLoading(false));
    }
  }
  async function ClaimReferralReward() {
    try {
      dispatch(setLoading(true));
      let res = await claimReferralReward();
      console.log(res);
      if (res) {
        ToastSuccess({ tHashLink: res.hash }).fire({
          title: 'Transaction Successful',
        });
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.log('error', error);
      dispatch(setLoading(false));
    }
  }
  const [islisting, setislisting] = useState(false);

  async function checkListing() {
    try {
      if (nftId) {
        const res = await callListings(nftId);
        let marketlistings = await callgetAllListedNFTs();
        let resArray: any[] = [];
        marketlistings &&
          (await marketlistings.map((item: any) => {
            const newArray = {
              tokenID: parseIntHex(item.tokenId),
              seller: item.seller,
              price: Number(ethers.utils.formatEther(item.price)),
            };
            resArray.push(newArray);
          }));
        console.log('resArray', resArray);
        setislisting(resArray.find(item => item.tokenID === nftId) ? true : false);
        console.log('checkListing', res, 'nftId', nftId, 'islisting');
      }
    } catch (error) {}
  }

  async function cancelListings() {
    try {
      if (nftId) {
        dispatch(setLoading(true));
        let res = await callCancelListing(nftId);
        console.log(res);
        res &&
          ToastSuccess({
            tHashLink: res.hash,
          }).fire('NFT Cancel Listing Successfully');
        dispatch(setLoading(false));
        checkListing();
      }
    } catch (error) {
      console.log(error);
      ToastError.fire({
        title: 'Something went wrong',
      });
      dispatch(setLoading(false));
    }
  }

  return (
    <Layout title='Personel Information'>
      <div className='grid grid-cols-2 xl:grid-cols-5 gap-3 md:gap-5 text-white'>
        <div className='col-span-2 xl:col-span-full p-3 md:p-4 2xl:p-6 justify-between items-center bg-cardBg border-cardBorder border-[3px] rounded-md shadow-md w-ful flex flex-col gap-3 relative'>
          <Image src={'/assets/cards/1.png'} width={500} height={500} quality={100} className=' absolute h-full w-fit -top-4 -left-4' alt='' />
          <Image src={'/assets/cards/2.png'} width={500} height={500} quality={100} className=' absolute h-full w-fit -bottom-4 -right-4' alt='' />
          <div className='flex justify-between w-full'>
            <div className='flex flex-col lg:flex-row gap-10'>
              <div className='flex gap-3 justify-start w-fit'>
                <svg className='w-12' viewBox='0 0 72 72' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path fillRule='evenodd' clipRule='evenodd' d='M36.0005 17.9999C29.3731 17.9999 24.0005 23.3725 24.0005 29.9999C24.0005 36.6274 29.3731 41.9999 36.0005 41.9999C42.6279 41.9999 48.0005 36.6274 48.0005 29.9999C48.0005 23.3725 42.6279 17.9999 36.0005 17.9999Z' fill='currentCOlor' />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M20.9993 5.99994C12.715 5.99994 5.99927 12.7157 5.99927 20.9999V50.9999C5.99927 59.2842 12.715 65.9999 20.9993 65.9999H50.9993C59.2835 65.9999 65.9993 59.2842 65.9993 50.9999V20.9999C65.9993 12.7157 59.2835 5.99994 50.9993 5.99994H20.9993ZM11.9993 20.9999C11.9993 16.0294 16.0287 11.9999 20.9993 11.9999H50.9993C55.9698 11.9999 59.9993 16.0294 59.9993 20.9999V50.9999C59.9993 53.6061 58.8915 55.9536 57.1212 57.5972C53.0649 50.0987 45.1301 44.9999 35.9986 44.9999C26.8674 44.9999 18.9329 50.0984 14.8765 57.5963C13.1067 55.9528 11.9993 53.6057 11.9993 50.9999V20.9999Z'
                    fill='currentCOlor'
                  />
                </svg>
                <h3>Wallet Name</h3>
              </div>
              <div>
                <h4 className='text-gray-400'>Total Revenue</h4>
                <h1>$ {totalRevenue}</h1>
              </div>
            </div>
            <div className='shrink-0 w-fit flex'>
              <Vip text={vipLvl === 3 ? 'VIP 3' : vipLvl === 2 ? 'VIP 2' : 'VIP 1'} />
            </div>
          </div>
          <div className='flex flex-col md:flex-row gap-3 xl:gap-6 justify-between w-full'>
            <div>
              <h4 className='text-gray-400'>Wallet Address</h4>
              <div className='flex gap-3'>
                <h3>{address && address.slice(0, 6) + '.....' + address.slice(address.length - 6, address.length)}</h3>

                <CopyBtn text={address} />
              </div>
            </div>
            <div className='flex gap-3 md:gap-6 w-full'>
              <div>
                <h4 className='text-gray-400'>Referral Reward</h4>
                <h2>$ {referralIncome}</h2>
              </div>
              <div>
                <h4 className='text-gray-400'>Binary Reward</h4>
                <h2>$ {withdrawableBalance}</h2>
              </div>
            </div>
            <div className='h-full w-full md:w-fit flex justify-end shrink-0  items-end'>
              {islisting ? (
                <button className='bg-purple transition-all hover:bg-red-500 shrink-0 group rounded-lg  px-4  w-32 h-11 text-white' onClick={cancelListings}>
                  <span className='group-hover:hidden'>On Sale</span>
                  <span className='hidden group-hover:block'>Cancel List</span>
                </button>
              ) : (
                <button className='bg-purple rounded-lg  px-4 p w-fit h-11 text-white' onClick={() => setModal(true)}>
                  {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  className=" w-full  "
                >
                  <path d="M286.788-81Q257-81 236-102.212q-21-21.213-21-51Q215-183 236.212-204q21.213-21 51-21Q317-225 338-203.788q21 21.213 21 51Q359-123 337.788-102q-21.213 21-51 21Zm400 0Q657-81 636-102.212q-21-21.213-21-51Q615-183 636.212-204q21.213-21 51-21Q717-225 738-203.788q21 21.213 21 51Q759-123 737.788-102q-21.213 21-51 21ZM235-741l110 228h288l125-228H235Zm-30-60h589.074q22.964 0 34.945 21Q841-759 829-738L694-495q-11 19-28.559 30.5Q647.881-453 627-453H324l-56 104h491v60H277q-42 0-60.5-28t.5-63l64-118-152-322H51v-60h117l37 79Zm140 288h288-288Z"></path>
                </svg> */}
                  Sell
                </button>
              )}
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className={` ${islisting && ''}  col-span-2 p-3 md:p-4 2xl:p-6 hidden  flex-col justify-center items-start gap-3 text-black bg-cardBg border-cardBorder border-[3px] rounded-md shadow-md relative`}>
          {islisting && <div className='absolute left-0 top-0 rounded-xl w-full h-full backdrop-blur-sm  cursor-not-allowed z-10 flex  ' />}
          <span className='text-gray-400'>Amount to be withdrawn</span>
          <div className='flex items-center relative w-full font-medium '>
            <input type='number' onChange={withdrawNumber} min={0} className='border-gray-200 border-2 bg-transparent text-white text-xl w-full rounded-lg outline-none text-end py-3 px-3' />
            <span className='absolute left-6 text-white '>$</span>
          </div>
          <div className='flex justify-center w-full '>
            <button type='submit' disabled={loading || islisting} className='bg-purple py-3 px-6 w-full md:w-2/3 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 justify-center flex gap-3 items-center'>
              Withdraw {loading && <Loading />}
            </button>
          </div>
        </form>
        <div className={` col-span-2 xl:col-span-3 p-3 md:p-4 2xl:p-6 justify-start items-center bg-cardBg border-cardBorder border-[3px] rounded-md shadow-md w-full flex flex-col gap-3 relative`}>
          <Image src={'/assets/cards/3.png'} width={500} height={500} quality={100} className=' absolute h-fit w-1/2 -top-6 mx-auto z-20' alt='' />
          {islisting && <div className='absolute left-0 top-0 rounded-sm w-full h-full bg-white/10 backdrop-blur-sm cursor-not-allowed z-10 flex  ' />}
          <h2 className='mb-3 w-full'>Experience</h2>
          <div className='flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between w-full'>
            <div className='flex flex-col gap-2'>
              <h3 className='text-gray-400'>Experience Point</h3>
              <h2>100/{LvlRatio({ lvl: lvl, low: lowPotentiel })}</h2>
            </div>
            <div className='flex flex-col gap-2'>
              <h3 className='text-gray-400 flex gap-3'>
                Maximum Withdraw Amount This Week{' '}
                <button type='button' onMouseOver={() => {}} className='text-gray-300 hover:text-gray-700 transition-colors'>
                  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12.2666 11C12.8189 11 13.2666 11.4477 13.2666 12V16C13.2666 16.5523 12.8189 17 12.2666 17C11.7143 17 11.2666 16.5523 11.2666 16V12C11.2666 11.4477 11.7143 11 12.2666 11ZM11.2666 8C11.2666 7.44772 11.7143 7 12.2666 7H12.2766C12.8289 7 13.2766 7.44772 13.2766 8C13.2766 8.55228 12.8289 9 12.2766 9H12.2666C11.7143 9 11.2666 8.55228 11.2666 8Z'
                      fill='currentColor'
                    />
                  </svg>
                </button>
              </h3>
              <h2>$ {vipLvl === 1 ? 2500 : vipLvl === 2 ? 5000 : 10000}</h2>
            </div>
          </div>
          <div className='flex justify-start items-center w-full gap-6 '>
            <div>
              <h3 className='text-gray-400'>Downlines</h3>
              <h3>{downlines}</h3>
            </div>
            {/* <div>
              <span className="text-gray-400">Referrals</span>
              <h3>3</h3>
            </div> */}
          </div>
          <div className='flex flex-col md:flex-row justify-between items-center w-full gap-3 md:gap-6 pt-8 md:pt-6'>
            <div className='border-[#1FCB4F] border-2 rounded-lg w-full  md:w-2/3 h-12 relative'>
              <div className='absolute border-[3px] h-12 w-14 bg-red-300 text-black border-yellow-400 rounded-full text-xl font-semibold -right-2 flex justify-center items-center -top-14 md:-top-[60px] scale-90'>{lvl} lvl</div>
              <div
                className={`h-full  ${LvlRatio({ lvl: lvl, low: lowPotentiel }) < 98 ? 'rounded-l-md' : 'rounded-md'}`}
                style={{
                  background: 'linear-gradient(90deg, #1FCB4F 0%, #96C535 53.08%, #FFC01E 100%)',
                  //background: "linear-gradient(90deg, #FFC11E 0%, #F46D22 100%)",

                  width: `${LvlRatio({ lvl: lvl, low: lowPotentiel })}%`,
                }}
              />
            </div>
            {/* <div className="w-20 border-2 border-[#FFC01E] right-0 flex justify-center items-center -top-14 bg-[#FFC01E]/20 h-11 px-4 font-semibold text-[#FFC01E]  rounded-full">
              VIP 2
            </div> */}
            <button onClick={() => setShow(true)} disabled={loading || islisting} className='border-2 border-purple disabled:bg-cardBg  disabled:text-black disabled:cursor-not-allowed hover:bg-purple w-full md:w-fit hover:text-white transition-colors rounded-md py-3 px-3 md:px-4 2xl:px-6 shrink-0'>
              Upgrade your wallet
            </button>
            {/* <button className="border-2 border-purple hover:bg-purple hover:text-white transition-colors rounded-md py-3 px-6">
              Level Up
            </button> */}
          </div>
        </div>
        <div className='flex flex-col col-span-2 p-3 md:p-4 2xl:p-6 gap-3 bg-cardBg border-cardBorder border-[3px] rounded-md shadow-md w-ful relative'>
          <Image src={'/assets/cards/1.png'} width={500} height={500} quality={100} className=' absolute h-fit w-fit -top-4 -left-4' alt='' />
          <Image src={'/assets/cards/2.png'} width={500} height={500} quality={100} className=' absolute h-fit w-fit -bottom-4 -right-4' alt='' />
          <h2 className='mb-3'>Referral Codes</h2>
          <span className='text-gray-400'>Left Referral Code</span>
          <div className='flex-col md:flex-row flex justify-between items-center gap-3'>
            <div className='border-gray-200 w-full border-2 flex justify-between p-3 rounded-lg '>
              <span>{refCode.left && refCode.left.slice(0, 8) + '.....' + refCode.left.slice(refCode.left.length - 8, refCode.left.length)}</span>
              <CopyBtn text={refCode.left} />
            </div>
            <button type='submit' disabled={loading} onClick={() => getReferralCodeLeft(address)} className='bg-purple py-3 px-6 w-full md:w-fit shrink-0 text-white rounded-md'>
              Generate
            </button>
          </div>
          <span className='text-gray-400'>Right Referral Code</span>
          <div className='flex-col md:flex-row flex justify-between items-center gap-3'>
            <div className='border-gray-200 w-full border-2 flex justify-between p-3 rounded-lg '>
              <span>{refCode.right && refCode.right.slice(0, 8) + '.....' + refCode.right.slice(refCode.right.length - 8, refCode.right.length)}</span>
              <CopyBtn text={refCode.right} />
            </div>
            <button type='submit' disabled={loading} onClick={() => getReferralCodeRight(address)} className='bg-purple py-3 px-6 w-full md:w-fit shrink-0 text-white rounded-md'>
              Generate
            </button>
          </div>
          <div className='flex flex-col w-full items-center gap-3'>
            {referralIncome > 0 && (
              <button type='submit' disabled={loading} onClick={() => ClaimReferralReward()} className='bg-purple py-3 px-6 w-2/3 text-white rounded-md'>
                Claim Referral Reward
              </button>
            )}
          </div>
        </div>
      </div>
      <Modal modal={show} setModal={setShow} title='Upgrade Your Wallet'>
        <form onSubmit={upVipLvl} className='w-full min-w-[60vw] xl:min-w-[40vw] p-6  relative'>
          <div className='w-full  flex flex-col gap-3'>
            <select name='upLvl' className='outline-none border-2 rounded-lg border-gray-200 p-3'>
              <option className='p-3' value='2'>
                <span className='w-full h-10 flex justify-center items-center p-2'>VIP 2</span>
              </option>
              <option className='p-3' value='3'>
                VIP 3
              </option>
            </select>
            <button type='submit' disabled={loading} className='bg-purple hover:opacity-95 text-white rounded-lg py-3 w-full flex justify-center items-center gap-3 disabled:opacity-90'>
              Upgrade {loading && <Loading />}
            </button>
          </div>
        </form>
      </Modal>
      <Modal modal={modal} setModal={setModal} title='Sell my account on marketplace'>
        <form onSubmit={listingNft} className='w-full min-w-[60vw] xl:min-w-[40vw] p-6  relative'>
          <div className='w-full  flex flex-col gap-3'>
            <input type='number' name='price' className='outline-none border-2 rounded-lg border-gray-200 p-3' placeholder='Price' />
            <button type='submit' disabled={loading} className='bg-purple hover:opacity-95 text-white rounded-lg py-3 w-full flex justify-center items-center gap-3 disabled:opacity-90'>
              List for sale {loading && <Loading />}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
