'use client'

import { useCallback, useEffect, useState } from 'react'
import { uploadToS3 } from '@/lib/s3'
import { isMobile as checkIsMobile } from 'react-device-detect'
import CreatePreview from '@/components/blog/CreatePreview'
import { useRouter } from 'next/navigation'
import { FaEye } from 'react-icons/fa'
import { PiSquareSplitHorizontal } from 'react-icons/pi'
import { MdOutlineChangeCircle } from 'react-icons/md'
import { GoArrowLeft } from 'react-icons/go'
import axios from 'axios'
import { toastHandler } from '@/lib/valtioAction'
import { uiState } from '@/lib/valtioState'
import { useSnapshot } from 'valtio'
import { useSession } from 'next-auth/react'

// react-select 會在初始化生成動態id或狀態，會與伺服器預渲染產生衝突，下面的設置為跳過伺服器預渲染的步驟。
import dynamic from 'next/dynamic'
import { getAllHandler } from '@/lib/axiosHandler'
import { customStyle } from './SelectCustomStyle'
const Select = dynamic(() => import('react-select'), { ssr: false })

export default function ArticleEditPage() {
  const { actionMode } = useSnapshot(uiState.adminArticle) // create, update
  const { categories, article } = useSnapshot(uiState)
  const { limit, offset } = useSnapshot(uiState.lazyLoad)
  const [title, setTitle] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [coverImageDescription, setCoverImageDescription] = useState('')
  const [activeTopInput, setActiveTopInput] = useState('title') // title, cover, description
  const [content, setContent] = useState('')
  const [viewMode, setViewMode] = useState('edit') // edit, preview
  const [category, setCategory] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [showTopInputList, setShowTopInputList] = useState(false)

  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    setIsMobile(checkIsMobile)
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (actionMode === 'update' && categories.data.length > 0) {
      setTitle(article.data.title)
      setCoverImage(article.data.coverImage)
      setContent(article.data.content)
      setCoverImageDescription(article.data.coverImageDescription || '')

      const selectedCategory = categories.data.find(
        (category) => category.id === article.data.categoryId
      )

      if (selectedCategory) {
        setCategory({
          value: selectedCategory.id,
          label: selectedCategory.name,
        })
      }
    }
  }, [actionMode, article.data, categories.data])

  useEffect(() => {
    const fetchCategories = () => {
      getAllHandler('/api/categories', 'categories')
    }

    fetchCategories()
  }, [])

  const options =
    categories.data &&
    categories.data.map((el) => ({
      value: el.id,
      label: el.name,
    }))

  const controlCategory = (e) => {
    setCategory(e)
  }

  const handleDrop = useCallback(async (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]

    if (file) {
      try {
        const url = await uploadToS3(file)
        const textarea = document.querySelector('textarea')
        if (url) {
          textarea.value += `<div className='w-full h-auto aspect-auto relative '><Image src='${url}' alt='cover image' width={0} height={0} sizes='100vw' priority className='w-full h-auto object-contain' /></div>`
        }
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }
  }, [])

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const createHandler = async () => {
    if (!title || !content || !coverImage) {
      alert('Please fill out all fields before publishing.')
      return
    }

    try {
      const response = await axios.post('/api/articles', {
        title,
        content,
        coverImage,
        coverImageDescription: coverImageDescription || null,
        categoryId: category && category.length !== 0 ? category.value : null,
      })
      if (response.status === 201) {
        goBlogPage()
        toastHandler('success', 'success')
      }
    } catch (error) {
      console.log(error)
      if (error.response) {
        console.error('Error:', error.response.data.error)
        return toastHandler(error.response.data.error, 'error')
      } else {
        console.error('An unexpected error occurred:', error.message)
      }
    }
  }

  const uploadHandler = async () => {
    if (!title || !content || !coverImage) {
      alert('Please fill out all fields before publishing.')
      return
    }
    try {
      const response = await axios.put(`/api/articles/${article.data.id}`, {
        title,
        content,
        coverImage,
        coverImageDescription: coverImageDescription || null,
        categoryId: category.value || null,
      })
      if (response.status === 201) {
        toastHandler('success', 'success')
        router.push(`/blog/${article.data.id}`)
      }
    } catch (error) {
      console.log(error)
      if (error.response) {
        console.error('Error:', error.response.data.error)
        return toastHandler(error.response.data.error, 'error')
      } else {
        console.error('An unexpected error occurred:', error.message)
      }
    }
  }

  const goBlogPage = () => {
    router.push(`/blog`)
    uiState.lazyLoad.offset = 0
    getAllHandler(
      `/api/articles?limit=${limit}&offset=${offset}`,
      'articles',
      {},
      true
    )
    setTitle('')
  }

  if (status !== 'authenticated') return null

  return (
    <main className={`w-screen h-[100dvh] overscroll-none `}>
      <div className='h-[60px] w-full text-[30px] border flex items-center'>
        <div className='border flex  ml-[20px] p-[5px] gap-[10px] rounded-[5px]'>
          <GoArrowLeft
            className={`p-[6px] rounded-[5px] cursor-pointer text-mainGrey-100 ${
              !isMobile && 'hover:scale-[1.05] hover:bg-mainGrey2-100'
            } `}
            onClick={goBlogPage}
          />
          <PiSquareSplitHorizontal
            className={`p-[6px] rounded-[5px] cursor-pointer text-mainGrey-100 ${
              !isMobile && 'hover:scale-[1.05] hover:bg-mainGrey2-100'
            } ${viewMode === 'edit' && 'bg-mainGrey2-100'}`}
            onClick={() => {
              setViewMode('edit')
            }}
          />
          <FaEye
            className={`p-[6px] rounded-[5px] cursor-pointer text-mainGrey-100 ${
              !isMobile && 'hover:scale-[1.05] hover:bg-mainGrey2-100'
            } ${viewMode === 'preview' && 'bg-mainGrey2-100'}`}
            onClick={() => {
              setViewMode('preview')
            }}
          />
        </div>
        <div className='relative'>
          <MdOutlineChangeCircle
            className={`cursor-pointer text-mainGrey-100 text-[20px] ml-[20px]  ${
              !isMobile && 'hover:scale-[1.05] hover:bg-mainGrey2-100'
            }`}
            onClick={() => {
              setShowTopInputList(!showTopInputList)
            }}
          />
          {showTopInputList && (
            <div className=' absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%+16px)]  bg-white z-10 shadow-[rgba(0,0,15,0.2)_0px_0px_10px_0px] rounded-[5px] text-[16px] whitespace-nowrap'>
              <p
                className={`px-[20px] py-[5px] cursor-pointer ${
                  isMobile
                    ? 'text-textBlack-100'
                    : 'text-textBlack-100/80 hover:text-textBlack-100 hover:bg-mainGrey2-100/50'
                }`}
                onClick={() => {
                  setActiveTopInput('title')
                  setShowTopInputList(false)
                }}
              >
                Title
              </p>
              <p
                className={`px-[20px] py-[5px] cursor-pointer ${
                  isMobile
                    ? 'text-textBlack-100'
                    : 'text-textBlack-100/80 hover:text-textBlack-100 hover:bg-mainGrey2-100/50'
                }`}
                onClick={() => {
                  setActiveTopInput('cover')
                  setShowTopInputList(false)
                }}
              >
                Cover Image
              </p>
              <p
                className={`px-[20px] py-[5px] cursor-pointer ${
                  isMobile
                    ? 'text-textBlack-100'
                    : 'text-textBlack-100/80 hover:text-textBlack-100 hover:bg-mainGrey2-100/50'
                }`}
                onClick={() => {
                  setActiveTopInput('description')
                  setShowTopInputList(false)
                }}
              >
                Description
              </p>
            </div>
          )}
        </div>
        <input
          type='text'
          className={`flex-1 mx-[16px] ml-[5px] gap-[10px] rounded-[5px] focus:outline-none p-[5px] `}
          placeholder={
            activeTopInput === 'title'
              ? 'Title'
              : activeTopInput === 'cover'
              ? 'Cover Image'
              : 'Description'
          }
          value={
            activeTopInput === 'title'
              ? title
              : activeTopInput === 'cover'
              ? coverImage
              : coverImageDescription
          }
          onChange={(e) => {
            if (activeTopInput === 'title') {
              setTitle(e.target.value)
            } else if (activeTopInput === 'cover') {
              setCoverImage(e.target.value)
            } else {
              setCoverImageDescription(e.target.value)
            }
          }}
        />
        <Select
          value={category}
          onChange={controlCategory}
          options={options}
          styles={customStyle}
          className='w-[200px] text-[15px] mr-[16px]'
          isSearchable={false}
          placeholder='Select Category'
          isSelected={true}
        />
        <button
          className={`mr-[20px] text-white px-[20px] py-[5px] rounded-[50px] text-[14px] EB-GaramondM ${
            isMobile ? 'bg-mainGrey-100' : 'bg-mainGrey-100/85'
          } ${!isMobile && 'hover:scale-[1.05] hover:bg-mainGrey-100'}`}
          onClick={() => {
            if (actionMode === 'create') {
              createHandler()
            }
            if (actionMode === 'update') {
              uploadHandler()
            }
          }}
        >
          PUBLISH
        </button>
      </div>
      <div
        className='w-full h-[calc(100%-60px)]  flex text-[20px]'
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <textarea
          className={`w-[50%]  border-r h-full p-[20px]  focus:outline-none ${
            viewMode === 'preview' && 'hidden'
          }`}
          onChange={(e) => {
            setContent(e.target.value)
          }}
          value={content}
        ></textarea>
        <div
          className={`h-full  p-[20px]  ${
            viewMode === 'preview' ? 'w-[100%] flex justify-center' : 'w-[50%]'
          }`}
        >
          <CreatePreview content={content} viewMode={viewMode} />
        </div>
      </div>
    </main>
  )
}
