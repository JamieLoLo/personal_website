import { proxy } from 'valtio'

export const uiState = proxy({
  articles: { data: [] },
  article: { data: {} },
  categories: { data: [] },
  toast: {
    toastVisible: false,
    message: '',
    status: '',
  },
  confirmModal: {
    confirmVisible: false,
    id: null,
    api: null,
    onRefresh: null,
  },
})

export const toastHandler = (message, status) => {
  uiState.toast.toastVisible = true
  uiState.toast.message = message
  uiState.toast.status = status

  setTimeout(() => {
    uiState.toast.toastVisible = false
  }, 3000)
}
