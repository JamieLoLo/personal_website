'use client'

import { useEffect, useState } from 'react'
import { isMobile as checkIsMobile } from 'react-device-detect'

export default function NotFound() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(checkIsMobile)
  }, [])
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <h1 className='text-4xl portraitPh:text-[30px] font-bold'>
        Page Not Found
      </h1>
      <p className='mt-4'>The page you are looking for does not exist.</p>
      <a
        href='/'
        className={`mt-[80px] text-white px-[20px] py-[5px] rounded-[50px] text-[15px] EB-GaramondM ${
          isMobile ? 'bg-mainGrey-100' : 'bg-mainGrey-100/85'
        } ${!isMobile && 'hover:scale-[1.05] hover:bg-mainGrey-100'}`}
      >
        Go back to Home
      </a>
      <p className='my-[10px]'>or</p>
      <a
        href='/blog'
        className={` text-white px-[20px] py-[5px] rounded-[50px] text-[15px] EB-GaramondM ${
          isMobile ? 'bg-mainGrey-100' : 'bg-mainGrey-100/85'
        } ${!isMobile && 'hover:scale-[1.05] hover:bg-mainGrey-100'}`}
      >
        Go back to Blog
      </a>
    </div>
  )
}
