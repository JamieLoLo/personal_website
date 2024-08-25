'use client'

import CubeModel from '@/components/mainPage/CubeModel'
import Image from 'next/image'
import { isMobile } from 'react-device-detect'

export default function Home() {
  return (
    <main className='w-screen h-[100dvh] relative overscroll-none'>
      <CubeModel />
    </main>
  )
}
