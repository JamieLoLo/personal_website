'use client'

import { isMobile } from 'react-device-detect'
import { motion } from 'framer-motion'
import { FaPencil, FaRegTrashCan } from 'react-icons/fa6'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Nav from './Nav'
import Image from 'next/image'
import ConfirmModal from './ConfirmModal'
import { deleteHandler, getAllHandler } from '@/lib/axiosHandler'
import { useSnapshot } from 'valtio'
import { uiState } from '@/lib/valtioState'

export default function CategoryEditPage() {
  const { data: session } = useSession()
  const [isMounted, setIsMounted] = useState(false)
  const { categories } = useSnapshot(uiState)

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

  if (!isMounted || categories.data.length === 0) {
    return (
      <div className='w-screen h-[100dvh] flex justify-center items-center'>
        <Image
          src='/images/loading.gif'
          alt='loading icon'
          width={90}
          height={90}
          className='object-cover'
        />
      </div>
    )
  }

  return (
    <motion.div className='w-screen h-[100dvh] flex justify-center items-start'>
      <Nav />
      <div className='my-[100px] flex flex-col items-center'>
        <p className='text-[30px] mb-[40px] EB-GaramondM'>All Categories</p>
        <table className='text-[18px] '>
          <thead className='EB-GaramondB'>
            <tr className=''>
              <th className='text-left'>id</th>
              <th className='text-left'>name</th>
            </tr>
          </thead>
          <tbody className='EB-GaramondR'>
            {categories.data &&
              categories.data.map((category, index) => (
                <tr key={`category${index}`}>
                  <td className='pr-[60px] '>{category.id}</td>
                  <td className='pr-[60px] '>{category.name}</td>
                  <td className='flex gap-[30px]'>
                    <FaPencil
                      className={`text-[16px] ml-[16px] cursor-pointer  translate-y-[1px] ${
                        isMobile ? 'text-mainGrey-100' : 'text-mainGrey-100/85'
                      } ${
                        !isMobile &&
                        'hover:scale-[1.05] hover:text-mainGrey-100'
                      }`}
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
