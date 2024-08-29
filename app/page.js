'use client'
import Image from 'next/image'
import { motion, AnimatePresence, m } from 'framer-motion'

import CubeModel from '@/components/mainPage/CubeModel'
import { uiState } from '@/lib/valtioState'
import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import Ticker from '@/components/mainPage/Ticker'

export default function Home() {
  const { introVisible } = useSnapshot(uiState.introPage)
  const { loadingVisible } = useSnapshot(uiState.loading)
  const [showTicker, setShowTicker] = useState(false)

  useEffect(() => {
    if (loadingVisible) {
      setTimeout(() => {
        uiState.introPage.introVisible = true
      }, 200)
    }
  }, [loadingVisible])

  const closeHandler = () => {
    uiState.introPage.introVisible = false
    setTimeout(() => {
      setShowTicker(true)
    }, 500)
  }

  return (
    <main className=' fixed top-0 left-0 w-screen h-[100dvh]  overscroll-none bg-black'>
      <motion.div
        className=' w-full h-full min-w-[120vw] min-h-[calc(100dvh+40px)] object-cover absolute top-1/2 left-1/2  '
        initial={{
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          x: '-50%',
          y: 'calc(-50% - 15px)',
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <Image
          src='/images/mainPageBg.webp'
          alt='intro'
          width={0}
          height={0}
          sizes='100vw'
          priority
          className='w-full h-full object-cover'
        />
      </motion.div>
      <div className=' w-full h-full object-cover absolute top-0 left-0 bg-black/70'></div>
      <AnimatePresence>
        {introVisible && (
          <motion.div
            className='w-full h-full absolute top-0 left-0 z-40 bg-black/40'
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
      <div className='w-full h-full absolute top-0 left-0'>
        <CubeModel />
      </div>
      <div className='fixed bottom-[24px] portraitPad:bottom-[20px] w-full flex justify-center'>
        <Ticker visible={showTicker} />
      </div>
    </main>
  )
}
