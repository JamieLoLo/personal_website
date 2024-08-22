'use client'

import { SessionProvider } from 'next-auth/react'
import Nav from './Nav'

export default function SessionProviderWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>
}
