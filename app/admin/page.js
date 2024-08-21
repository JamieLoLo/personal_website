'use client'

import Nav from '@/components/blog/Nav'
import PostPreview from '@/components/blog/PostPreview'
import RightList from '@/components/blog/RightList'
import { dummyData } from '@/dummyData'
import Image from 'next/image'
import { isMobile } from 'react-device-detect'
import { FaUserLarge } from 'react-icons/fa6'
import { FaLock } from 'react-icons/fa'

export default function Admin() {
  return (
    <div className='w-screen h-[100dvh] flex items-center justify-center'>
      <form
        action=''
        className='w-[250px] relative flex flex-col items-center'
        method='POST'
      >
        <div className='w-full border rounded-[50px] flex py-[10px] px-[10px]'>
          <label
            htmlFor='account'
            className='w-[40px] relative flex justify-center'
          >
            <FaUserLarge className='text-[22px] text-mainGrey-100' />
          </label>
          <input
            type='text'
            name='account'
            id='account'
            className='flex-1 focus:outline-none'
          />
        </div>
        <div className='w-full border rounded-[50px] flex mt-[16px] py-[10px] px-[10px]'>
          <label
            htmlFor='password'
            className='w-[40px] relative flex justify-center '
          >
            <FaLock className='text-[22px] text-mainGrey-100' />
          </label>
          <input
            type='password'
            name='password'
            id='password'
            className='flex-1 focus:outline-none'
          />
        </div>
        <button
          type='submit'
          className={`translate-y-[100%] text-white px-[20px] py-[5px] rounded-[50px] text-[14px] EB-GaramondM mt-[40px] ${
            isMobile ? 'bg-mainGrey-100' : 'bg-mainGrey-100/85'
          } ${!isMobile && 'hover:scale-[1.05] hover:bg-mainGrey-100'}`}
        >
          LOGIN
        </button>
      </form>
    </div>
  )
}
