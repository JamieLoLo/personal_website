'use client'

import Nav from '@/components/blog/Nav'
import PostPreview from '@/components/blog/PostPreview'
import RightList from '@/components/blog/RightList'
import SessionProviderWrapper from '@/components/blog/SessionProviderWrapper'
import { getAllHandler } from '@/lib/axiosHandler'
import { uiState } from '@/lib/valtioState'
import { useEffect, useRef, useState } from 'react'
import { useSnapshot } from 'valtio'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

// react-select 會在初始化生成動態id或狀態，會與伺服器預渲染產生衝突，下面的設置為跳過伺服器預渲染的步驟。
// import dynamic from 'next/dynamic'
// import { customStyle } from '../../components/blog/SelectCustomStyle'
// import { isMobile as checkIsMobile } from 'react-device-detect'

// const Select = dynamic(() => import('react-select'), { ssr: false })

export default function Blog() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  // const { articles, categories, selectedCategory } = useSnapshot(uiState)
  // const { offset } = useSnapshot(uiState.lazyLoad)
  // const [category, setCategory] = useState(null)
  // const scrollRef = useRef(null)
  // const limit = 8
  // const bottomRef = useRef(null)

  // useEffect(() => {
  //   if (selectedCategory && categories.data.length > 0) {
  //     let label = categories.data.find((el) => el.id === selectedCategory).name
  //     setCategory({ value: selectedCategory, label: label })
  //   }
  // }, [selectedCategory])

  // const controlCategory = (e) => {
  //   uiState.lazyLoad.offset = 0

  //   if (e.value === 9999) {
  //     uiState.selectedCategory = null
  //     setCategory({ value: 9999, label: 'All' })
  //     getAllHandler('/api/articles', 'articles', {}, true)
  //   } else {
  //     uiState.selectedCategory = e.value
  //     getAllHandler('/api/articles', 'articles', { categoryId: e.value }, true)
  //   }
  // }

  // const customOption = { value: 9999, label: 'All' }

  // const options = categories.data && [
  //   customOption,
  //   ...categories.data
  //     .filter((el) => el.Articles.length !== 0) // 過濾掉沒有文章的分類
  //     .map((el) => ({
  //       value: el.id,
  //       label: el.name,
  //     })),
  // ]

  // const fetchAllArticles = () => {
  //   getAllHandler(`/api/articles?limit=${limit}&offset=${offset}`, 'articles')
  // }

  // const fetchArticlesByCategory = (categoryId) => {
  //   getAllHandler(
  //     `/api/articles?limit=${limit}&offset=${offset}&categoryId=${categoryId}`,
  //     'articles'
  //   )
  // }

  // const fetchCategories = () => {
  //   getAllHandler('/api/categories', 'categories')
  // }

  // useEffect(() => {
  //   if (!selectedCategory) {
  //     fetchAllArticles()
  //   }
  //   fetchCategories()
  // }, [selectedCategory])

  // const handleDataRefresh = () => {
  //   fetchAllArticles()
  // }

  // useEffect(() => {
  //   if (articles.data.length === 0 || categories.data.length === 0) {
  //     uiState.loading.colorMode = 'light'
  //     uiState.loading.loadingVisible = true
  //   } else {
  //     setTimeout(() => {
  //       uiState.loading.loadingVisible = false
  //     }, 1000)
  //   }
  // }, [articles.data, categories.data])

  // // Intersection Observer for lazy loading
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (
  //         entries[0].isIntersecting &&
  //         articles.data.length < articles.total
  //       ) {
  //         uiState.lazyLoad.offset = offset + limit
  //       }
  //     },
  //     {
  //       root: null,
  //       rootMargin: '0px',
  //       threshold: 1.0,
  //     }
  //   )

  //   if (bottomRef.current) {
  //     observer.observe(bottomRef.current)
  //   }

  //   return () => {
  //     if (bottomRef.current) {
  //       observer.unobserve(bottomRef.current)
  //     }
  //   }
  // }, [articles])

  // useEffect(() => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollTo(0, 0)
  //   }
  // }, [selectedCategory])

  // useEffect(() => {
  //   if (offset > 0 && !selectedCategory) {
  //     fetchAllArticles()
  //   }
  //   if (offset > 0 && selectedCategory) {
  //     fetchArticlesByCategory(selectedCategory)
  //   }
  // }, [offset, selectedCategory])

  return (
    <motion.div
      className="w-screen h-[100dvh] flex justify-center "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SessionProviderWrapper>
        <Nav />
      </SessionProviderWrapper>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-4">
        <p className="text-black ">維護中...</p>
        <a
          href="/"
          className={`bg-red-500 px-[10px] py-[5px] text-white rounded-[5px] ${
            !isMobile && 'hover:scale-[1.05]'
          }`}
          onClick={() => {
            router.push('/')
          }}
        >
          Return to Home
        </a>
      </div>

      {/* <div className='w-[85%] landscapePad:w-[90%] portraitPad:w-[90%] portraitPh:w-[95%] landscapePhone:w-[95%]  h-[calc(100%-60px)] mt-[60px] relative flex  portraitPh:flex-col landscapePhone:flex-col'>
        <div className='w-full my-4 hidden portraitPh:flex landscapePhone:flex'>
          <Select
            onChange={controlCategory}
            options={options}
            styles={customStyle}
            className='w-full text-[15px]'
            isSearchable={false}
            placeholder='All'
            isSelected={true}
            value={category || ''}
          />
        </div>

        <div
          className='w-[70%] portraitPh:w-full landscapePhone:w-full pl-[2.5vw] h-full relative py-[5%] pr-[5%] overflow-y-scroll overscroll-none'
          ref={scrollRef}
        >
          {articles.data &&
            articles.data.map((item, index) => (
              <div key={item.id} className='w-full '>
                <PostPreview
                  index={index}
                  article={item}
                  onRefresh={handleDataRefresh}
                />
                {Number(index) !== articles.data.length - 1 && (
                  <div className='border-t w-full my-[20px]'></div>
                )}
              </div>
            ))}
          <div ref={bottomRef} className='h-[1px]'></div>
        </div>
        <div className='w-[30%] h-full relative portraitPh:hidden landscapePhone:hidden '>
          <RightList
            categories={categories.data}
            articlesTotal={articles.total}
          />
        </div>
      </div> */}
    </motion.div>
  )
}
