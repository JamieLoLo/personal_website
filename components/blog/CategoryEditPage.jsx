'use client'

import { isMobile as checkIsMobile } from 'react-device-detect'
import { motion } from 'framer-motion'
import { FaPencil, FaRegTrashCan } from 'react-icons/fa6'
import { useEffect, useState } from 'react'
import Nav from './Nav'
import { getAllHandler } from '@/lib/axiosHandler'
import { useSnapshot } from 'valtio'
import { uiState } from '@/lib/valtioState'
import axios from 'axios'
import { toastHandler } from '@/lib/valtioAction'
import SessionProviderWrapper from '@/components/blog/SessionProviderWrapper'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CategoryEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [id, setId] = useState(null)
  const [name, setName] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mode, setMode] = useState('create')
  const { categories } = useSnapshot(uiState)

  useEffect(() => {
    setIsMobile(checkIsMobile)
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/signin')
    }
  }, [status, router])

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true)
    }, 500)
  }, [])

  const fetchCategories = () => {
    getAllHandler('/api/categories', 'categories')
  }

  useEffect(() => {
    if (isMounted) {
      fetchCategories()
    }
  }, [isMounted])

  const handleDataRefresh = () => {
    fetchCategories()
  }

  useEffect(() => {
    if (
      (!isMounted || categories.data.length === 0) &&
      status === 'authenticated'
    ) {
      uiState.loading.loadingVisible = true
    } else {
      setTimeout(() => {
        uiState.loading.loadingVisible = false
      }, 1000)
    }
  }, [isMounted, categories.data, status])

  const createHandler = async () => {
    if (!name) {
      alert('Name is required!')
      return
    }

    try {
      const response = await axios.post('/api/categories', {
        name,
      })
      if (response.status === 201) {
        toastHandler('success', 'success')
        fetchCategories()
        setName('')
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
    if (!name) {
      alert('Name is required!')
      return
    }

    try {
      const response = await axios.put(`/api/categories/${id}`, {
        name,
      })
      if (response.status === 201) {
        toastHandler('success', 'success')
        fetchCategories()
        setName('')
        setId(null)
        setMode('create')
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

  if (status !== 'authenticated') return null

  return (
    <motion.div
      className={`w-screen h-[100dvh] flex justify-center items-start`}
    >
      <SessionProviderWrapper>
        <Nav />
      </SessionProviderWrapper>
      <div className='my-[100px] flex flex-col items-center'>
        <p className='text-[30px] EB-GaramondM'>All Categories</p>
        <div className='flex my-[30px]'>
          <input
            type='text'
            className='border mr-4 focus:outline-none px-[5px] rounded-[5px]'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <button
            className={` text-white px-[20px] py-[5px] rounded-[5px] text-[14px] EB-GaramondM ${
              isMobile ? 'bg-mainGrey-100' : 'bg-mainGrey-100/85'
            } ${!isMobile && 'hover:scale-[1.05] hover:bg-mainGrey-100'}`}
            onClick={() => {
              if (mode === 'create') {
                createHandler()
              }
              if (mode === 'update') {
                uploadHandler()
              }
            }}
          >
            {mode === 'create' ? 'Create' : 'Update'}
          </button>
        </div>
        <table className='text-[18px] '>
          <tbody className='EB-GaramondR'>
            {categories.data &&
              categories.data.map((category, index) => (
                <tr
                  key={`category${index}`}
                  className=' flex items-center justify-between'
                >
                  <td className='pr-[60px] '>{category.name}</td>
                  <td className='flex gap-[30px]'>
                    <FaPencil
                      className={`text-[16px] ml-[16px] cursor-pointer  translate-y-[1px] ${
                        isMobile ? 'text-mainGrey-100' : 'text-mainGrey-100/85'
                      } ${
                        !isMobile &&
                        'hover:scale-[1.05] hover:text-mainGrey-100'
                      }`}
                      onClick={() => {
                        setId(category.id)
                        setMode('update')
                        setName(category.name)
                      }}
                    />
                    <FaRegTrashCan
                      className={`text-[16px] ml-[16px] cursor-pointer  translate-y-[1px] ${
                        isMobile ? 'text-red-500' : 'text-red-500/85'
                      } ${
                        !isMobile && 'hover:scale-[1.05] hover:text-red-500-100'
                      }`}
                      onClick={() => {
                        uiState.confirmModal.confirmVisible = true
                        uiState.confirmModal.id = category.id
                        uiState.confirmModal.api = '/api/categories'
                        uiState.confirmModal.onRefresh = handleDataRefresh
                      }}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
