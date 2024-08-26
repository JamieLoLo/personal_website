'use client'

import Image from 'next/image'
import { isMobile } from 'react-device-detect'
import { RxCross2 } from 'react-icons/rx'
// 暫時沒有更新的需求，因此沒有跟部落格一樣存入資料庫，未來會用別的形式呈現。
import { projectInfoData } from '@/database/projectInfoData'
import { useEffect, useRef, useState } from 'react'
import { LuExternalLink } from 'react-icons/lu'
import { useSnapshot } from 'valtio'
import { uiState } from '@/lib/valtioState'

export default function ProjectInfo() {
  const { visible, activeProject } = useSnapshot(uiState.projectInfo)
  const [isScrollBottom, setIsScrollBottom] = useState(false)
  const [showScrollFilter, setShowScrollFilter] = useState(true)
  const scrollContainerRef = useRef()

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
  }, [])

  useEffect(() => {
    setShowScrollFilter(!isScrollBottom)
  }, [isScrollBottom])

  const handleScroll = () => {
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
  return (
    <main className='w-screen h-[100dvh] fixed top-0 left-0 z-[40]  overscroll-none NotoSansR whitespace-pre-wrap text-justify'>
      <div className='w-full h-full bg-mainGrey-100/80'></div>
      <div className='w-[520px] h-[70%] overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 rounded-[20px] -translate-y-1/2 bg-infoBg-100 flex items-center justify-center'>
        {showScrollFilter && (
          <div className='bg-infoBg-100 rounded-b-[20px] blur-md absolute bottom-[-30px] left-0 w-full h-[80px]'></div>
        )}
        <div className='w-[calc(100%-50px)]  h-[calc(100%-40px)] flex flex-col'>
          <div className='flex justify-end'>
            <RxCross2
              className={`text-[30px] cursor-pointer  translate-y-[1px] ${
                isMobile ? 'text-mainGrey-100' : 'text-mainGrey-100/85'
              } ${!isMobile && 'hover:scale-[1.05] hover:text-mainGrey-100'}`}
            />
          </div>
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
          <div
            className=' overflow-y-scroll overscroll-none '
            onScroll={handleScroll}
            ref={scrollContainerRef}
          >
            <div className='w-full h-auto aspect-[1/0.52] relative mb-4'>
              <Image
                src={`/images/${projectInfoData[activeProject].img}`}
                alt='loading icon'
                width={0}
                height={0}
                sizes='100vw'
                priority
                className='w-full h-auto object-contain'
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
              <p className='text-[15px]'>{projectInfoData[activeProject].jd}</p>
            </div>
            <div>
              <p className='text-[17px] NotoSansM mb-1'>展覽簡介</p>
              <p className='text-[15px]'>
                {projectInfoData[activeProject].intro}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
