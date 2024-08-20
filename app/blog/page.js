import Nav from '@/components/blog/Nav'
import RightList from '@/components/blog/RightList'
import Image from 'next/image'

export default function Home() {
  return (
    <div className='w-screen h-[100dvh] flex justify-center'>
      <Nav />
      <div className='w-[80%]  h-[calc(100%-60px)] mt-[60px] relative flex'>
        <div className='w-[70%] relative'></div>
        <div className='w-[30%] relative'>
          <RightList />
        </div>
      </div>
    </div>
  )
}
