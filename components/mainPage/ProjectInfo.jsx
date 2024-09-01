'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { LuExternalLink } from 'react-icons/lu'
import { motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { isMobile as checkIsMobile } from 'react-device-detect'
import { uiState } from '@/lib/valtioState'
import { projectInfoData } from '@/database/projectInfoData'

export default function ProjectInfo() {
  const { infoVisible, activeProject } = useSnapshot(uiState.projectInfo)
  const [isScrollBottom, setIsScrollBottom] = useState(false)
  const [showScrollFilter, setShowScrollFilter] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const scrollContainerRef = useRef()
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (activeProject) {
      setImageLoaded(false) // 切換時，重置圖片加載狀態
    }
  }, [activeProject])

  useEffect(() => {
    setIsMobile(checkIsMobile)
  }, [])

  useEffect(() => {
    if (scrollContainerRef.current) {
      if (
        scrollContainerRef.current.scrollHeight >
        scrollContainerRef.current.clientHeight
      ) {
        setIsScrollBottom(false)
      } else {
        setIsScrollBottom(true)
      }
    }
  }, [activeProject])

  useEffect(() => {
    setShowScrollFilter(!isScrollBottom)
  }, [isScrollBottom])

  const handleImageLoadComplete = () => {
    setImageLoaded(true) // 當圖片加載完成時設置狀態為true
  }

  const scrollHandle = () => {
    const scrollContainer = scrollContainerRef.current

    if (scrollContainer) {
      const isAtBottom =
        scrollContainer.scrollHeight - scrollContainer.scrollTop <
        scrollContainer.clientHeight + 16

      if (isAtBottom) {
        setIsScrollBottom(true)
      } else {
        setIsScrollBottom(false)
      }
    }
  }

  const closeHandler = () => {
    uiState.projectInfo.infoVisible = false
    setTimeout(() => {
      uiState.activeProject = ''
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0
      }
    }, 200)
  }

  return (
    <motion.div
      className={`w-screen h-[100dvh] fixed top-0 left-0 z-[40]  overscroll-none NotoSansR whitespace-pre-wrap text-justify ${
        infoVisible && imageLoaded
          ? 'pointer-events-auto'
          : 'pointer-events-none'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: infoVisible && imageLoaded ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className='w-full h-full bg-bgBlack-100/60'
        onClick={closeHandler}
      ></motion.div>
      <motion.div
        className='w-[550px] portraitPh:w-[calc(100%-20px)]  h-[75%] landscapePad:h-[85%] portraitPh:h-[calc(100%-32px)] overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 rounded-[20px] -translate-y-1/2 bg-infoBg-100 flex items-center justify-center'
        initial={{ x: '-50%', y: '100vh' }}
        animate={{
          x: '-50%',
          y: infoVisible && imageLoaded ? '-50%' : '100vh',
        }}
        transition={{ duration: 0.5 }}
      >
        {showScrollFilter && (
          <div className='bg-infoBg-100 rounded-b-[20px] blur-md absolute bottom-[-30px] left-0 w-full h-[80px]'></div>
        )}
        <div className='w-[calc(100%-50px)]  h-[calc(100%-40px)] flex flex-col'>
          <div className='flex justify-end'>
            <RxCross2
              className={`text-[30px] cursor-pointer ${
                isMobile ? 'text-mainGrey-100' : 'text-mainGrey-100/85'
              } ${!isMobile && 'hover:scale-[1.05] hover:text-mainGrey-100'}`}
              onClick={closeHandler}
            />
          </div>
          {activeProject && (
            <div className='flex flex-col mb-4'>
              <p className='text-[20px] NotoSansM mb-1'>
                {projectInfoData[activeProject].title}
              </p>
              <a
                href={projectInfoData[activeProject].link}
                target='_blank'
                className={`cursor-pointer ${
                  isMobile ? 'text-mainGrey-100' : 'text-mainGrey-100/85'
                } ${!isMobile && ' hover:text-mainGrey-100'} `}
              >
                <div className='flex items-center gap-[8px]'>
                  前往網站
                  <LuExternalLink />
                </div>
              </a>
            </div>
          )}
          {activeProject && (
            <div
              className=' overflow-y-scroll overscroll-none '
              onScroll={scrollHandle}
              ref={scrollContainerRef}
            >
              <div className='w-full h-auto aspect-[1/0.52] relative mb-4'>
                <Image
                  src={`/images/${projectInfoData[activeProject].img}`}
                  alt='project cover image'
                  width={0}
                  height={0}
                  sizes='100vw'
                  priority
                  className='w-full h-auto object-contain'
                  onLoad={handleImageLoadComplete}
                />
              </div>
              <div className='mb-4'>
                <p className='text-[17px] NotoSansM mb-1'>館方</p>
                <p className='text-[15px]'>
                  {projectInfoData[activeProject].museum}
                </p>
              </div>
              <div className='mb-4'>
                <p className='text-[17px] NotoSansM mb-1'>負責內容</p>
                <p className='text-[15px]'>
                  {projectInfoData[activeProject].jd}
                </p>
              </div>
              {projectInfoData[activeProject].game && (
                <div className='mb-4'>
                  <p className='text-[17px] NotoSansM mb-3'>互動遊戲</p>
                  <div className='w-full h-auto aspect-[1/0.52] relative mb-3'>
                    <Image
                      src={`/images/${projectInfoData[activeProject].game.img}`}
                      alt='game image'
                      width={0}
                      height={0}
                      sizes='100vw'
                      priority
                      className='w-full h-auto object-contain'
                    />
                  </div>
                  <p className='text-[15px]'>
                    {projectInfoData[activeProject].game.content}
                  </p>
                </div>
              )}

              <div>
                <p className='text-[17px] NotoSansM mb-1'>展覽簡介</p>
                <p className='text-[15px]'>
                  {projectInfoData[activeProject].intro}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
