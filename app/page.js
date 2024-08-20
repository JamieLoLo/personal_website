import CubeModel from '@/components/mainPage/CubeModel'
import Image from 'next/image'

export default function Home() {
  return (
    <main className='w-screen h-[100dvh] bg-mainGrey2-100 main relative overscroll-none'>
      <a
        href='/blog'
        className='fixed top-[20px] right-[20px] z-10 bg-white px-[20px] py-[5px]'
      >
        GO BLOG
      </a>
      <div className='w-full h-full absolute top-0 left-0 bg-mainGrey2-100/90 '></div>
      <CubeModel />
    </main>
  )
}
