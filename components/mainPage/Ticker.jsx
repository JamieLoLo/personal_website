import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

export default function Ticker() {
  const tickerRef = useRef(null)
  const [contentWidth, setContentWidth] = useState(0)

  useEffect(() => {
    if (tickerRef.current) {
      setContentWidth(tickerRef.current.scrollWidth)
    }
  }, [])

  return (
    <div className='w-[40%] h-[50px] overflow-hidden relative  text-[24px] text-ticker-100 new-amsterdam-regular'>
      <motion.div
        className='flex whitespace-nowrap '
        initial={{ x: 0 }}
        animate={{ x: -contentWidth }}
        transition={{
          ease: 'linear',
          duration: contentWidth / 40, // 控制速度
          repeat: Infinity,
        }}
      >
        <div ref={tickerRef} className='flex translate-y-[8px]'>
          <p className='ml-[16px]'>
            DISCOVER MORE INSIGHTS BY FLIPPING TO THE BOTTOM & CLICK TO EXPLORE
            MY BLOG!
          </p>
          <p className='ml-[16px]'>
            DISCOVER MORE INSIGHTS BY FLIPPING TO THE BOTTOM & CLICK TO EXPLORE
            MY BLOG!
          </p>
        </div>
        <div className='flex translate-y-[8px]'>
          <p className='ml-[16px]'>
            DISCOVER MORE INSIGHTS BY FLIPPING TO THE BOTTOM & CLICK TO EXPLORE
            MY BLOG!
          </p>
          <p className='ml-[16px]'>
            DISCOVER MORE INSIGHTS BY FLIPPING TO THE BOTTOM & CLICK TO EXPLORE
            MY BLOG!
          </p>
        </div>
      </motion.div>
      {/* 下面是四個邊角 */}
      <div className='absolute top-0 left-0 border-ticker-100 border-l border-t w-[12px] h-[12px] z-10'></div>
      <div className='absolute bottom-0 left-0 border-ticker-100 border-l border-b w-[12px] h-[12px] z-10'></div>
      <div className='absolute top-0 right-0 border-ticker-100 border-r border-t w-[12px] h-[12px] z-10'></div>
      <div className='absolute bottom-0 right-0 border-ticker-100 border-r border-b w-[12px] h-[12px] z-10'></div>
      {/* 左右遮罩 */}
      <div className='absolute top-1/2 left-[-10px] -translate-y-1/2 w-[24px] h-[150%] bg-black blur-md '></div>
      <div className='absolute top-1/2 right-[-10px] -translate-y-1/2 w-[24px] h-[150%] bg-black blur-md '></div>
    </div>
  )
}
