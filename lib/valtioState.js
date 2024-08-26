import { proxy } from 'valtio'

export const uiState = proxy({
  projectInfo: {
    visible: false,
    activeProject: 'gihraf',
  },
  articles: { data: [] },
  article: { data: {} },
  adminArticle: {
    actionMode: '', //create, update
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
  loading: {
    loadingVisible: false,
  },
})
