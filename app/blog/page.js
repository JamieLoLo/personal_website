'use client'

import Nav from '@/components/blog/Nav'
import PostPreview from '@/components/blog/PostPreview'
import RightList from '@/components/blog/RightList'
import SessionProviderWrapper from '@/components/blog/SessionProviderWrapper'
import { getAllHandler } from '@/lib/axiosHandler'
import { uiState } from '@/lib/valtioState'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { motion } from 'framer-motion'

export default function Blog() {
  const { articles, categories } = useSnapshot(uiState)

  const fetchArticles = () => {
    getAllHandler('/api/articles', 'articles')
  }

  const fetchCategories = () => {
    getAllHandler('/api/categories', 'categories')
  }

  useEffect(() => {
    fetchArticles()
    fetchCategories()
  }, [])

  const handleDataRefresh = () => {
    fetchArticles()
  }

  useEffect(() => {
    if (articles.data.length === 0 || categories.data.length === 0) {
      uiState.loading.loadingVisible = true
    } else {
      setTimeout(() => {
        uiState.loading.loadingVisible = false
      }, 1000)
    }
  }, [articles.data, categories.data])

  return (
    <motion.div
      className='w-screen h-[100dvh] flex justify-center'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SessionProviderWrapper>
        <Nav />
      </SessionProviderWrapper>
      <div className='w-[85%]   h-[calc(100%-60px)] mt-[60px] relative flex'>
        <div className='w-[70%] pl-[2.5vw] h-full relative py-[5%] pr-[5%] overflow-y-scroll overscroll-none'>
          <SessionProviderWrapper>
            {articles.data &&
              articles.data.map((item, index) => (
                <div key={item.id} className='w-full '>
                  <PostPreview
                    index={index}
                    title={item.title}
                    content={item.content}
                    coverImage={item.coverImage}
                    id={item.id}
                    onRefresh={handleDataRefresh}
                  />
                  {Number(index) !== articles.data.length - 1 && (
                    <div className='border-t w-full my-[20px]'></div>
                  )}
                </div>
              ))}
          </SessionProviderWrapper>
        </div>
        <div className='w-[30%] h-full relative '>
          <RightList categories={categories.data} />
        </div>
      </div>
    </motion.div>
  )
}
