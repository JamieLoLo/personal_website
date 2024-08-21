import Nav from '@/components/blog/Nav'
import PostPreview from '@/components/blog/PostPreview'
import RightList from '@/components/blog/RightList'
import { dummyData } from '@/dummyData'
import Image from 'next/image'

export default function Blog() {
  return (
    <div className='w-screen h-[100dvh] flex justify-center'>
      <Nav />
      <div className='w-[85%]   h-[calc(100%-60px)] mt-[60px] relative flex'>
        <div className='w-[70%] pl-[2.5vw] h-full relative py-[5%] pr-[5%] overflow-y-scroll overscroll-none'>
          {dummyData.map((item, index) => (
            <div key={item.id} className='w-full '>
              <PostPreview title={item.title} content={item.content} />
              {Number(index) !== dummyData.length - 1 && (
                <div className='border-t w-full my-[20px]'></div>
              )}
            </div>
          ))}
        </div>
        <div className='w-[30%] h-full relative '>
          <RightList />
        </div>
      </div>
    </div>
  )
}
