'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import DotsList from './DotsList'
import SessionProviderWrapper from './SessionProviderWrapper'
import { uiState } from '@/lib/valtioState'

export default function PostPreview({ article, onRefresh, index }) {
  const router = useRouter()

  const goSingleArticle = () => {
    router.push(`/blog/${article.id}`)
    uiState.loading.colorMode = 'light'
    uiState.loading.loadingVisible = true
  }

  return (
    <div
      className='w-full flex cursor-pointer relative'
      onClick={goSingleArticle}
    >
      <div className=' absolute top-0 right-0 portraitPh:-translate-y-[12px] '>
        <SessionProviderWrapper>
          <DotsList
            target='preview'
            index={index}
            id={article.id}
            onRefresh={onRefresh}
          />
        </SessionProviderWrapper>
      </div>

      <div className='w-[75%] portraitPad:w-full landscapePhone:w-full'>
        <p className='text-[24px] NotoSansM portraitPh:text-[20px]'>
          {article.title}
        </p>
        <ReactMarkdown
          className='text-[16px] text-mainGrey-100 py-[16px]  text-justify'
          rehypePlugins={[rehypeRaw]}
        >
          {article.previewContent}
        </ReactMarkdown>
        <p className='text-[13px] text-mainGrey-100 mt-[20px]'>
          {article.createdAt}
        </p>
      </div>
      <div className='w-[250px] h-auto aspect-[1/0.52] relative  ml-[50px] mt-[20px] flex items-center portraitPad:hidden landscapePhone:hidden'>
        <Image
          src={article.coverImage}
          alt='cover image'
          width={0}
          height={0}
          sizes='100vw'
          priority
          className='w-full h-auto object-contain'
        />
      </div>
    </div>
  )
}
