'use client'

import { isMobile } from 'react-device-detect'
import { useSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { FaPowerOff, FaPencil } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'

export default function Nav() {
  const { data: session } = useSession()
  const router = useRouter()

  const goBlogPage = () => {
    router.push(`/blog`)
  }

  return (
    <div className='fixed top-0 left-0 w-full h-[60px] z-10 flex border-b items-center justify-between px-[20px] bg-white'>
      <p
        className='text-[25px] EB-GaramondB cursor-pointer'
        onClick={goBlogPage}
      >
        Jamie&apos;s Blog
      </p>

      <div className='flex gap-[22px] items-center'>
        <a
          href='/'
          className={` text-white px-[20px] py-[5px] rounded-[50px] text-[14px] EB-GaramondM ${
            isMobile ? 'bg-mainGrey-100' : 'bg-mainGrey-100/85'
          } ${!isMobile && 'hover:scale-[1.05] hover:bg-mainGrey-100'}`}
        >
          GO HOME
        </a>
        {session && session.user.name === 'Jamie' && (
          <FaPencil
            className={`text-[26px] cursor-pointer  ${
              isMobile ? 'text-mainGrey-100' : 'text-mainGrey-100/85'
            } ${!isMobile && 'hover:scale-[1.05] hover:text-mainGrey-100'}`}
          />
        )}
        {session && session.user.name === 'Jamie' && (
          <FaPowerOff
            className={`text-[26px] cursor-pointer text-mainGrey-100 ${
              isMobile ? 'text-mainGrey-100' : 'text-mainGrey-100/85'
            } ${!isMobile && 'hover:scale-[1.05] hover:text-mainGrey-100'}`}
            onClick={signOut}
          />
        )}
      </div>
    </div>
  )
}
