'use client'
import Image from 'next/image'
import { motion, AnimatePresence, m } from 'framer-motion'

import CubeModel from '@/components/mainPage/CubeModel'
import { uiState } from '@/lib/valtioState'
import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import Ticker from '@/components/mainPage/Ticker'
import { windowSizeState } from '@/lib/windowSize'
import { isMobile as checkIsMobile } from 'react-device-detect'

export default function Home() {
  const { introVisible } = useSnapshot(uiState.introPage)
  const { loadingVisible } = useSnapshot(uiState.loading)
  const { mobileMode } = useSnapshot(windowSizeState)
  const { isLoaded } = useSnapshot(uiState.model)
  const [showTicker, setShowTicker] = useState(false)
  const [isExploreBtnHovered, setIsExploreBtnHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(checkIsMobile)
  }, [])

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
      <div
        className={`w-full h-full object-cover absolute top-0 left-0  ${
          isLoaded ? 'bg-black/70' : 'bg-bgBlack-100'
        }`}
      ></div>
      <AnimatePresence>
        {introVisible && (
          <motion.div
            className='w-full h-full absolute top-0 left-0 z-40 bg-black/40 pointer-events-auto  '
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <div className='w-full h-auto absolute top-[20%] portraitPh:top-[25%] landscapePhone:top-[17%] left-[5%]'>
              <Image
                src={
                  mobileMode ? '/images/intro_ph.png' : '/images/intro_pc.png'
                }
                alt='intro'
                width={0}
                height={0}
                sizes='100vw'
                priority
                className=' w-[80%] portraitPh:w-[90%] h-auto object-contain'
              />
              <div className='w-full h-auto mt-[15%] portraitPad:mt-[20%] portraitPh:mt-[40%] landscapePhone:mt-[8%]  flex portraitPh:justify-center portraitPh:pr-[10%] landscapePhone:justify-center landscapePhone:pr-[10%]'>
                <Image
                  src={
                    isExploreBtnHovered && !isMobile
                      ? '/images/exploreBtn_b.png'
                      : '/images/exploreBtn_w.png'
                  }
                  alt='explore button'
                  width={0}
                  height={0}
                  sizes='100vw'
                  priority
                  className={` w-[150px] portraitPh:w-[130px] landscapePhone:w-[130px] h-auto object-contain border-2 p-4 cursor-pointer ${
                    !isMobile && 'hover:bg-white'
                  } `}
                  onClick={closeHandler}
                  onMouseEnter={() => {
                    if (!isMobile) {
                      setIsExploreBtnHovered(true)
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      setIsExploreBtnHovered(false)
                    }
                  }}
                />
              </div>
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
