import { isMobile } from 'react-device-detect'

export default function Nav() {
  return (
    <div className='fixed top-0 left-0 w-full h-[60px] flex border-b items-center justify-between px-[20px]'>
      <p className='text-[25px] EB-GaramondB'>Jamie&apos;s Blog</p>

      <a
        href='/'
        className={` text-white px-[20px] py-[5px] rounded-[50px] text-[14px] EB-GaramondM ${
          isMobile ? 'bg-mainGrey-100' : 'bg-mainGrey-100/85'
        } ${!isMobile && 'hover:scale-[1.05] hover:bg-mainGrey-100'}`}
      >
        GO HOME
      </a>
    </div>
  )
}
