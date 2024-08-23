import Image from 'next/image'
import { isMobile } from 'react-device-detect'
import { FaPencil } from 'react-icons/fa6'
import { useSession, signOut } from 'next-auth/react'

export default function CategoryItem({ item }) {
  const { data: session } = useSession()
  return (
    <div className='mt-[3px] flex items-center'>
      <p
        key={item.id}
        className={`text-[14px]  NotoSansR cursor-pointer ${
          isMobile
            ? 'text-textBlack-100'
            : 'text-mainGrey-100 hover:text-textBlack-100'
        }`}
      >
        {item.name}
      </p>
      {session && session.user.name === 'Jamie' && (
        <FaPencil
          className={`text-[15px] ml-[16px] cursor-pointer  ${
            isMobile ? 'text-mainGrey-100' : 'text-mainGrey-100/85'
          } ${!isMobile && 'hover:scale-[1.05] hover:text-mainGrey-100'}`}
        />
      )}
    </div>
  )
}
