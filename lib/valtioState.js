import { lazy } from 'react'
import { proxy } from 'valtio'

export const uiState = proxy({
  selectedCategory: null,
  lazyLoad: {
    offset: 0,
    limit: 8,
  },
  introPage: { introVisible: false },
  projectInfo: {
    infoVisible: false,
    activeProject: '',
  },
  articles: { data: [], total: 0 },
  article: { data: {} },
  adminArticle: {
    actionMode: '', // create, update
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
    colorMode: 'dark', // dark, light
  },
  model: {
    isLoaded: false,
  },
})
