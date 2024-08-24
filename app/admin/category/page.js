'use client'

import CategoryEditPage from '@/components/blog/CategoryEditPage'
import { SessionProvider } from 'next-auth/react'

export default function Category() {
  return (
    <SessionProvider>
      <CategoryEditPage />
    </SessionProvider>
  )
}
