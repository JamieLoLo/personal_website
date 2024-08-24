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
