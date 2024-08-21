'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function PostPreview({ title, content, id }) {
  const router = useRouter()

  const previewContent =
    content.length > 50 ? content.slice(0, 50) + '...' : content

  const handleClick = () => {
    router.push(`/blog/${id}`)
  }

  return (
    <div className='w-full flex cursor-pointer' onClick={handleClick}>
      <div className='w-[75%]'>
        <p className='text-[24px] NotoSansM'>{title}</p>
        <p className='text-[16px] text-mainGrey-100 py-[16px] whitespace-pre-wrap text-justify'>
          {previewContent}
        </p>
        <p className='text-[13px] text-mainGrey-100 mt-[20px]'>MAR 5, 2024</p>
      </div>
      <div className='w-[25%] relative ml-[8%] '>
        <Image
          src='/images/test.webp'
          alt='logo'
          fill
          className='w-full object-contain '
        />
      </div>
    </div>
  )
}
