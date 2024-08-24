'use client'

import { uiState } from '@/lib/valtioState'
import { isMobile } from 'react-device-detect'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { deleteHandler } from '@/lib/axiosHandler'

export default function ConfirmModal() {
  const { confirmVisible, id, api, onRefresh } = useSnapshot(
    uiState.confirmModal
  )

  return (
    <AnimatePresence>
      {confirmVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className='fixed z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px]  bg-white shadow-[rgba(0,0,15,0.1)_0px_0px_10px_0px] rounded-[5px] flex flex-col justify-center gap-[25px] items-center'
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <p className='NotoSansM text-[35px] text-textBlack-100'>Delete?</p>
          <div className='flex gap-[20px] NotoSansR'>
            <button
              className={`bg-red-500 px-[10px] py-[5px] text-white rounded-[5px] ${
                !isMobile && 'hover:scale-[1.05]'
              }`}
              onClick={() => {
                deleteHandler(api, id, onRefresh)
                uiState.confirmModal.confirmVisible = false
              }}
            >
              Delete
            </button>
            <button
              className={`bg-green-500 px-[10px] py-[5px] text-white rounded-[5px] ${
                !isMobile && 'hover:scale-[1.05]'
              }`}
              onClick={() => {
                uiState.confirmModal.confirmVisible = false
              }}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
