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

export default function Blog() {
  const { articles, categories } = useSnapshot(uiState)
  const [offset, setOffset] = useState(0)
  const limit = 8
  const bottomRef = useRef(null)

  const fetchArticles = () => {
    getAllHandler(`/api/articles?limit=${limit}&offset=${offset}`, 'articles')
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
      uiState.loading.colorMode = 'light'
      uiState.loading.loadingVisible = true
    } else {
      setTimeout(() => {
        uiState.loading.loadingVisible = false
      }, 1000)
    }
  }, [articles.data, categories.data])

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          articles.data.length < articles.total
        ) {
          setOffset((prevOffset) => prevOffset + limit)
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      }
    )

    if (bottomRef.current) {
      observer.observe(bottomRef.current)
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current)
      }
    }
  }, [articles])

  useEffect(() => {
    if (offset > 0) {
      fetchArticles()
    }
  }, [offset])

  return (
    <motion.div
      className='w-screen h-[100dvh] flex justify-center '
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SessionProviderWrapper>
        <Nav />
      </SessionProviderWrapper>

      <div className='w-[85%] landscapePad:w-[90%] portraitPad:w-[90%] portraitPh:w-[95%] landscapePhone:w-[95%]  h-[calc(100%-60px)] mt-[60px] relative flex'>
        <div className='w-[70%] portraitPh:w-full landscapePhone:w-full pl-[2.5vw] h-full relative py-[5%] pr-[5%] overflow-y-scroll overscroll-none'>
          {articles.data &&
            articles.data.map((item, index) => (
              <div key={`article_${item.id}`} className='w-full '>
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
      </div>
    </motion.div>
  )
}
