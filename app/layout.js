import { Inter } from 'next/font/google'
import './globals.css'
import Toast from '@/components/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Jamie's Personal Website",
  description: "Jamie's Portfolio and Blog",
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className='NotoSansR select-none'>
        {children}
        <Toast />
      </body>
    </html>
  )
}
