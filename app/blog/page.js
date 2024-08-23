'use client'

import Nav from '@/components/blog/Nav'
import PostPreview from '@/components/blog/PostPreview'
import RightList from '@/components/blog/RightList'
import SessionProviderWrapper from '@/components/blog/SessionProviderWrapper'
import axios from 'axios'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Blog() {
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])

  const fetchArticles = async () => {
    try {
      const response = await axios.get('/api/articles')
      setArticles(response.data)
    } catch (error) {
      console.error('Error fetching articles:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching articles:', error)
    }
  }

  useEffect(() => {
    fetchArticles()
    fetchCategories()
  }, [])

  const handleDataRefresh = () => {
    fetchArticles()
  }

  return (
    <div className='w-screen h-[100dvh] flex justify-center'>
      <SessionProviderWrapper>
        <Nav />
      </SessionProviderWrapper>
      <div className='w-[85%]   h-[calc(100%-60px)] mt-[60px] relative flex'>
        <div className='w-[70%] pl-[2.5vw] h-full relative py-[5%] pr-[5%] overflow-y-scroll overscroll-none'>
          <SessionProviderWrapper>
            {articles.map((item, index) => (
              <div key={item.id} className='w-full '>
                <PostPreview
                  title={item.title}
                  content={item.content}
                  coverImage={item.coverImage}
                  id={item.id}
                  onRefresh={handleDataRefresh}
                />
                {Number(index) !== articles.length - 1 && (
                  <div className='border-t w-full my-[20px]'></div>
                )}
              </div>
            ))}
          </SessionProviderWrapper>
        </div>
        <div className='w-[30%] h-full relative '>
          <RightList categories={categories} />
        </div>
      </div>
    </div>
  )
}
