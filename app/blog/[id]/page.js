'use client'

import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import '../../../app/markdownStyle.css'
import Nav from '@/components/blog/Nav'
import SessionProviderWrapper from '@/components/blog/SessionProviderWrapper'
import { getOneHandler } from '@/lib/axiosHandler'
import { uiState } from '@/lib/valtioState'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSnapshot } from 'valtio'
import { motion } from 'framer-motion'
import DotsList from '@/components/blog/DotsList'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function BlogPostPage() {
  const router = useRouter()
  const { article } = useSnapshot(uiState)
  const path = usePathname()

  const fetchArticle = () => {
    getOneHandler('/api/articles', path.split('/')[2], 'article')
  }

  useEffect(() => {
    fetchArticle()
  }, [])

  useEffect(() => {
    if (article.data && article.data.length !== 0) {
      setTimeout(() => {
        uiState.loading.loadingVisible = false
      }, 200)
    }
  }, [article.data])

  const handleRefresh = () => {
    router.push('/blog')
  }

  return (
    <motion.div
      className='w-screen h-[100dvh] flex justify-center relative overflow-y-scroll overscroll-none select-text '
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SessionProviderWrapper>
        <Nav />
      </SessionProviderWrapper>
      <div className='w-[700px] portraitPad:w-[90%] portraitPh:w-[95%] landscapePhone:w-[95%]  h-[calc(100%-60px)] mt-[60px]   py-[50px] px-[10px] flex  flex-col relative'>
        <div className=' absolute top-0 left-0 translate-y-[200%] translate-x-[5px]'>
          <SessionProviderWrapper>
            <DotsList
              target='singleArticle'
              id={article.data.id}
              onRefresh={handleRefresh}
            />
          </SessionProviderWrapper>
        </div>

        <p className='text-[40px] portraitPh:text-[26px] NotoSansB tracking-tight'>
          {article.data.title}
        </p>
        <p className='text-[14px] NotoSansM text-mainGrey-100 my-[20px]'>
          {article.data.createdAt}
        </p>
        <div className='w-full h-auto aspect-auto relative '>
          {article.data.coverImage && (
            <Image
              src={article.data.coverImage}
              alt='cover image'
              width={0}
              height={0}
              sizes='100vw'
              priority
              className='w-full h-auto object-contain'
            />
          )}
        </div>
        {article.data.coverImageDescription && (
          <ReactMarkdown
            className='whitespace-pre-wrap leading-[34px]  text-[18px] NotoSerifR mb-[20px] markdown-body'
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            remarkPlugins={[remarkGfm]}
          >
            {article.data.coverImageDescription}
          </ReactMarkdown>
        )}

        <ReactMarkdown
          className='whitespace-pre-wrap leading-[34px] mt-[10px] text-[18px] NotoSerifR pb-[20%] markdown-body'
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          remarkPlugins={[remarkGfm]}
        >
          {article.data.content}
        </ReactMarkdown>
      </div>
    </motion.div>
  )
}
