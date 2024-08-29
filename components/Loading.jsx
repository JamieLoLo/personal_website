'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { uiState } from '@/lib/valtioState'

export default function Loading() {
  const { loadingVisible, colorMode } = useSnapshot(uiState.loading)
  const twinkleVariants = {
    show: {
      opacity: [0.2, 0.4, 0.6, 0.8, 1, 0.8, 0.6, 0.4, 0.2],
      transition: {
        duration: 1.4,
        repeat: Infinity,
        ease: 'linear',
      },
    },
    hide: {
      opacity: [0],
    },
  }

  return (
    <AnimatePresence>
      {loadingVisible && (
        <motion.div
          className={`fixed top-0 left-0 z-[50] w-screen h-[100dvh] flex justify-center items-center  ${
            colorMode === 'dark' ? 'bg-bgBlack-100' : 'bg-white'
          }`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className='w-[160px] h-auto flex items-start justify-center relative aspect-[1/0.17]'
            variants={twinkleVariants}
            initial='hide'
            animate='show'
          >
            <Image
              src={`${
                colorMode === 'dark'
                  ? '/images/loading_white.png'
                  : '/images/loading_grey.png'
              }`}
              alt='loading icon'
              fill
              sizes='160px'
              className='object-contain'
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
