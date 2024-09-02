import { Inter } from 'next/font/google'
import './globals.css'
import Toast from '@/components/Toast'
import ConfirmModal from '@/components/blog/ConfirmModal'
import Loading from '@/components/Loading'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Jamie's Personal Website",
  description: "Jamie's Portfolio and Blog",
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XCPERNLLGT`}
          strategy='afterInteractive'
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XCPERNLLGT', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className='NotoSansR select-none'>
        {children}
        <Toast />
        <ConfirmModal />
        <Loading />
      </body>
    </html>
  )
}
