'use client'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

import CubeModel from '@/components/mainPage/CubeModel'
import { uiState } from '@/lib/valtioState'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'

export default function Home() {
  const { introVisible } = useSnapshot(uiState.introPage)
  const { loadingVisible } = useSnapshot(uiState.loading)

  const closeHandler = () => {
    uiState.introPage.introVisible = false
  }

  useEffect(() => {
    if (loadingVisible) {
      setTimeout(() => {
        uiState.introPage.introVisible = true
      }, 200)
    }
  }, [loadingVisible])

  return (
    <main className=' fixed top-0 left-0 w-screen h-[100dvh]  overscroll-none bg-black'>
      <Image
        src='/images/bg7.webp'
        alt='intro'
        width={0}
        height={0}
        sizes='100vw'
        priority
        className=' w-full h-full min-w-[120vw] object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
      />
      <div className=' w-full h-full object-cover absolute top-0 left-0 bg-mainGrey-100/10'></div>
      <AnimatePresence>
        {introVisible && (
          <motion.div
            className='w-full h-full absolute top-0 left-0 z-40 bg-black/30'
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className='w-full h-auto absolute top-[20%] left-[5%]'>
              <Image
                src='/images/intro.png'
                alt='intro'
                width={0}
                height={0}
                sizes='100vw'
                priority
                className=' w-[80%] h-auto object-contain'
              />

              <Image
                src='/images/exploreBtn.png'
                alt='explore button'
                width={0}
                height={0}
                sizes='100vw'
                priority
                className='mt-[150px] w-[150px] h-auto object-contain border-2 p-4 cursor-pointer'
                onClick={closeHandler}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CubeModel />
    </main>
  )
}
