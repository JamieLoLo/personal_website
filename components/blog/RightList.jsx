import Image from 'next/image'
import SessionProviderWrapper from './SessionProviderWrapper'
import CategoryItem from './CategoryItem'

export default function RightList({ categories }) {
  return (
    <div className='  absolute top-0 right-0 w-full h-full border-l pt-[10%] pl-[10%] pr-[2.5vw] overflow-y-scroll overscroll-none '>
      <div className='w-[90px] h-[90px] relative '>
        <Image
          src='/images/avatar.jpg'
          alt='logo'
          fill
          sizes='(max-width: 768px) 90px, (max-width: 1200px) 90px, 90px'
          className='object-cover rounded-[50%]'
        />
      </div>
      <div className='NotoSansM EB-GaramondM text-[17px] mt-[20px] leading-[22px]'>
        <p>Jamie Lo</p>
        <p>Front-end Developer</p>
      </div>
      <p className='text-justify text-[14px] text-mainGrey-100 mt-[16px]'>
        正在往網頁開發這個知識量爆炸的黑洞前行，內容多為平時的筆記整理，希望也能幫助到同樣在這條道路上前進的人
        💪
      </p>
      <div className=' mt-[40px]  '>
        <p className='NotoSansM text-[15px]'>文章分類</p>
        <div className='mt-[8px]'>
          <SessionProviderWrapper>
            {categories.map((item, index) => (
              <CategoryItem
                key={`categoryItem_${index}`}
                item={item}
                categories={categories}
              />
            ))}
          </SessionProviderWrapper>
        </div>
      </div>
    </div>
  )
}
