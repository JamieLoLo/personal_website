import { proxy } from 'valtio'

export const uiState = proxy({
  articles: { data: [] },
  article: { data: {} },
  adminArticle: {
    actionMode: '', //create, edit
  },
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
  postPreview: { activeDots: null },
})
