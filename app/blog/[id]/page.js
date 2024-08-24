'use client'

import Nav from '@/components/blog/Nav'
import SessionProviderWrapper from '@/components/blog/SessionProviderWrapper'
import { getOneHandler } from '@/lib/axiosHandler'
import { uiState } from '@/lib/valtio'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { useSnapshot } from 'valtio'

export default function BlogPostPage() {
  const { article } = useSnapshot(uiState)
  const path = usePathname()

  const fetchArticle = () => {
    getOneHandler('/api/articles', path.split('/')[2], 'article')
  }

  useEffect(() => {
    fetchArticle()
  }, [])

  return (
    <div className='w-screen h-[100dvh] flex justify-center relative overflow-y-scroll overscroll-none '>
      <SessionProviderWrapper>
        <Nav />
      </SessionProviderWrapper>
      <div className='w-[700px] h-[calc(100%-60px)] mt-[60px]   py-[50px] px-[10px] flex  flex-col'>
        <p className='text-[40px] NotoSansB tracking-tight'>
          {article.data.title}
        </p>
        <p className='text-[13px] NotoSansM text-mainGrey-100 mt-[20px]'>
          {article.data.createdAt}
        </p>
        {/* <div className='w-full relative flex flex-col mt-[20px]'>
          <div className='relative w-full h-0 pb-[58.25%]'>
            <Image
              src='/images/test.webp'
              alt='logo'
              layout='fill'
              className='object-contain'
            />
          </div>
          <p className='text-center text-[13px] NotoSansM text-mainGrey-100 mt-[20px]'>
            Photo by Joshua Aragon on Unsplash
          </p>
        </div> */}
        <ReactMarkdown
          className='whitespace-pre-wrap mt-[50px] text-[20px] NotoSerifR pb-[20%]'
          rehypePlugins={[rehypeRaw]}
        >
          {article.data.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
