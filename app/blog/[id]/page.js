'use client'

import Nav from '@/components/blog/Nav'
import SessionProviderWrapper from '@/components/blog/SessionProviderWrapper'
import axios from 'axios'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

export default function BlogPostPage() {
  const path = usePathname()
  const router = useRouter()

  const [article, setArticle] = useState([])

  useEffect(() => {
    const fetchArticle = async (id) => {
      try {
        const response = await axios.get(`/api/article/${id}`)
        setArticle(response.data)
      } catch (error) {
        console.error('Error fetching article:', error)
      }
    }

    fetchArticle(path.split('/')[2])
  }, [])

  return (
    <div className='w-screen h-[100dvh] flex justify-center relative overflow-y-scroll overscroll-none '>
      <SessionProviderWrapper>
        <Nav />
      </SessionProviderWrapper>
      <div className='w-[700px] h-[calc(100%-60px)] mt-[60px]   py-[50px] px-[10px] flex  flex-col'>
        <p className='text-[40px] NotoSansB tracking-tight'>{article.title}</p>
        <p className='text-[13px] NotoSansM text-mainGrey-100 mt-[20px]'>
          {article.createdAt}
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
          className=' whitespace-pre-wrap mt-[50px] text-[20px] NotoSerifR pb-[20%]'
          children={article.content}
          rehypePlugins={[rehypeRaw]}
        />
      </div>
    </div>
  )
}
