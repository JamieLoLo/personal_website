'use client'

import ArticleEditPage from '@/components/blog/ArticleEditPage'
import { SessionProvider } from 'next-auth/react'

export default function AdminArticle() {
  return (
    <SessionProvider>
      <ArticleEditPage />
    </SessionProvider>
  )
}
