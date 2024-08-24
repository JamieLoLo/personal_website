import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { isMobile } from 'react-device-detect'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { uiState } from '@/lib/valtioState'

export default function PostPreview({ title, content, id, onRefresh }) {
  const [showList, setShowList] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const dots = Array(3).fill(null)
  const previewContent =
    content.length > 30 ? content.slice(0, 30) + '...' : content

  const handleClick = () => {
    router.push(`/blog/${id}`)
  }

  return (
    <div className='w-full flex cursor-pointer relative' onClick={handleClick}>
      {session && session.user.name === 'Jamie' && (
        <div
          className='absolute top-0 right-0 p-[5px] flex gap-[2px] cursor-pointer z-10 text-textBlack-100'
          onClick={(e) => {
            e.stopPropagation()
            setShowList(!showList)
          }}
        >
          {dots.map((_, index) => (
            <div
              key={`select_dot_${index}`}
              className='w-[4px] h-[4px] rounded-[50%] bg-mainGrey-100'
            ></div>
          ))}
          {showList && (
            <div className=' absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%+16px)]  bg-white z-10 shadow-[rgba(0,0,15,0.2)_0px_0px_10px_0px] rounded-[5px]'>
              <p
                className={`px-[20px] py-[5px] ${
                  isMobile
                    ? 'text-textBlack-100'
                    : 'text-textBlack-100/80 hover:text-textBlack-100'
                }`}
              >
                Edit
              </p>
              <p
                className={`px-[20px] py-[5px] ${
                  isMobile
                    ? 'text-red-500'
                    : 'text-red-500/80 hover:text-red-500'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowList(false)
                  uiState.confirmModal.confirmVisible = true
                  uiState.confirmModal.id = id
                  uiState.confirmModal.api = '/api/articles'
                  uiState.confirmModal.onRefresh = onRefresh
                }}
              >
                Delete
              </p>
            </div>
          )}
        </div>
      )}

      <div className='w-[75%]'>
        <p className='text-[24px] NotoSansM'>{title}</p>
        <ReactMarkdown
          className='text-[16px] text-mainGrey-100 py-[16px] whitespace-pre-wrap text-justify'
          rehypePlugins={[rehypeRaw]}
        >
          {previewContent}
        </ReactMarkdown>
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
