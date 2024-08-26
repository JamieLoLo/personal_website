'use client'

import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { isMobile as checkIsMobile } from 'react-device-detect'
import { FaUserLarge } from 'react-icons/fa6'
import { FaLock } from 'react-icons/fa6'

export default function Admin() {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMobile(checkIsMobile)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = await signIn('credentials', {
      redirect: false,
      account,
      password,
    })

    if (result?.error) {
      setShowErrorMsg(true)
    } else {
      router.push('/blog')
    }
  }

  return (
    <div className='w-screen h-[100dvh] flex items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        className='w-[250px] relative flex flex-col items-center'
      >
        <div className='w-full border rounded-[50px] flex py-[10px] px-[10px] relative'>
          {showErrorMsg && (
            <p className='text-red-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[350%] whitespace-nowrap NotoSansB'>
              Invalid username or password
            </p>
          )}

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
            value={account}
            onChange={(e) => {
              setAccount(e.target.value)
              setShowErrorMsg(false)
            }}
            className='flex-1 focus:outline-none bg-white'
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
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setShowErrorMsg(false)
            }}
            className='flex-1 focus:outline-none bg-white'
          />
        </div>
        <button
          type='submit'
          className={`translate-y-[100%] text-white px-[20px] py-[5px] rounded-[50px] text-[14px] EB-GaramondM mt-[40px] ${
            isMobile ? 'bg-mainGrey-100' : 'bg-mainGrey-100/85'
          } ${!isMobile && 'hover:scale-[1.05] hover:bg-mainGrey-100'}`}
        >
          SIGN IN
        </button>
      </form>
    </div>
  )
}
