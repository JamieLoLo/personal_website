'use client'

import { SessionProvider } from 'next-auth/react'
import Nav from './Nav'

export default function NavWrapper() {
  return (
    <SessionProvider>
      <Nav />
    </SessionProvider>
  )
}
