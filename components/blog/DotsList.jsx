import { getOneHandler } from '@/lib/axiosHandler'
import { uiState } from '@/lib/valtioState'
import { useEffect, useState } from 'react'
import { isMobile as checkIsMobile } from 'react-device-detect'
import { useSnapshot } from 'valtio'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function DotsList({ target, index, id, onRefresh }) {
  const { data: session } = useSession()

  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const { activeDots } = useSnapshot(uiState.postPreview)
  const [showList, setShowList] = useState(false)
  const dots = Array(3).fill(null)

  useEffect(() => {
    setIsMobile(checkIsMobile)
  }, [])

  const goEdit = () => {
    uiState.adminArticle.actionMode = 'update'
    getOneHandler('/api/articles', id, 'article')
    router.push(`/admin/article`)
  }

  return (
    <>
      {session && (
        <div
          className='p-[5px] flex gap-[2px] cursor-pointer z-10 text-textBlack-100'
          onClick={(e) => {
            if (target === 'preview') {
              e.stopPropagation()
              uiState.postPreview.activeDots = index
            }
            setShowList(!showList)
          }}
        >
          {dots.map((_, index) => (
            <div
              key={`select_dot_${index}`}
              className='w-[4px] h-[4px] rounded-[50%] bg-mainGrey-100'
            ></div>
          ))}
          {((showList &&
            Number(activeDots) === Number(index) &&
            target === 'preview') ||
            (showList && target === 'singleArticle')) && (
            <div className=' absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%+16px)]  bg-white z-10 shadow-[rgba(0,0,15,0.2)_0px_0px_10px_0px] rounded-[5px]'>
              <p
                className={`px-[20px] py-[5px] ${
                  isMobile
                    ? 'text-textBlack-100'
                    : 'text-textBlack-100/80 hover:text-textBlack-100'
                }`}
                onClick={goEdit}
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
    </>
  )
}
