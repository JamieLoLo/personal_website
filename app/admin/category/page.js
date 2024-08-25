'use client'

import SessionProviderWrapper from '@/components/blog/SessionProviderWrapper'
import CategoryEditPage from '@/components/blog/CategoryEditPage'

export default function Category() {
  return (
    <SessionProviderWrapper>
      <CategoryEditPage />
    </SessionProviderWrapper>
  )
}
