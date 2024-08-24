import { isMobile } from 'react-device-detect'
import { FaPencil } from 'react-icons/fa6'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CategoryList({ categories }) {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <>
      <div className='flex items-center'>
        <p className='NotoSansM text-[15px]'>文章分類</p>
        {session && session.user.name === 'Jamie' && (
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
        {categories.map((category, index) => (
          <div
            key={`categoryList_${index}`}
            className='mt-[3px] flex items-center'
          >
            <p
              key={category.id}
              className={`text-[14px]  NotoSansR cursor-pointer ${
                isMobile
                  ? 'text-textBlack-100'
                  : 'text-mainGrey-100 hover:text-textBlack-100'
              }`}
            >
              {category.name}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}
