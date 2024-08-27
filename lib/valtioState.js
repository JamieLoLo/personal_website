import { proxy } from 'valtio'

export const uiState = proxy({
  introPage: { introVisible: false },
  projectInfo: {
    visible: false,
    activeProject: 'gihraf',
  },
  articles: { data: [], total: 0 },
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
