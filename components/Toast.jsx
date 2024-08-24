'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { uiState } from '@/lib/valtio'
import { useSnapshot } from 'valtio'

export default function Toast() {
  const { toastVisible, message, status } = useSnapshot(uiState.toast)

  return (
    <AnimatePresence>
      {toastVisible && (
        <motion.p
          className={`fixed bottom-[20px] left-[20px] text-white flex ${
            status === 'success' ? 'bg-green-500' : 'bg-red-500'
          }  py-[8px] px-[10px] rounded-[5px]`}
          initial={{ opacity: 0, y: '200%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '200%' }}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
