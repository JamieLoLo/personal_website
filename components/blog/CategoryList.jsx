'use client'
import { isMobile as checkIsMobile } from 'react-device-detect'
import { FaPencil } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { getAllHandler } from '@/lib/axiosHandler'
import { uiState } from '@/lib/valtioState'

export default function CategoryList({ categories, articlesTotal }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(checkIsMobile)
  }, [])

  return (
    <>
      <div className='flex items-center'>
        <p className='NotoSansM text-[15px]'>文章分類</p>
        {session && (
          <FaPencil
            className={`text-[14px] ml-[16px] cursor-pointer  translate-y-[1px] ${
              isMobile ? 'text-mainGrey-100' : 'text-mainGrey-100/85'
            } ${!isMobile && 'hover:scale-[1.05] hover:text-mainGrey-100'}`}
            onClick={() => {
              router.push('/admin/category')
            }}
          />
        )}
      </div>

      <div className='mt-[8px]'>
        <p
          className={` text-[14px]  NotoSansR cursor-pointer ${
            isMobile
              ? 'text-textBlack-100'
              : 'text-mainGrey-100 hover:text-textBlack-100'
          }`}
          onClick={() => {
            uiState.lazyLoad.offset = 0
            uiState.selectedCategory = null
            getAllHandler('/api/articles', 'articles', {}, true)
          }}
        >
          All ({articlesTotal})
        </p>
        {categories.map((category) => {
          if (category.Articles.length !== 0) {
            return (
              <div key={category.id} className='mt-[3px] flex items-center'>
                <p
                  className={`text-[14px]  NotoSansR cursor-pointer ${
                    isMobile
                      ? 'text-textBlack-100'
                      : 'text-mainGrey-100 hover:text-textBlack-100'
                  }`}
                  onClick={() => {
                    uiState.lazyLoad.offset = 0
                    uiState.selectedCategory = category.id
                    getAllHandler(
                      '/api/articles',
                      'articles',
                      { categoryId: category.id },
                      true
                    )
                  }}
                >
                  {category.name} ({category.Articles.length})
                </p>
              </div>
            )
          }
        })}
      </div>
    </>
  )
}
