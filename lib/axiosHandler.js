import axios from 'axios'
import { uiState } from './valtioState'
import { toastHandler } from './valtioAction'

export const getAllHandler = async (api, target, params = {}) => {
  try {
    const response = await axios.get(api, { params })
    if (response.data.totalArticlesCount) {
      uiState[target].total = response.data.totalArticlesCount

      // 檢查文章是否已存在，避免重複加載
      const newArticles = response.data.articles.filter(
        (newArticle) =>
          !uiState[target].data.some(
            (existingArticle) => existingArticle.id === newArticle.id
          )
      )
      // 這邊不能直接使用 uiState[target].data = response.data.articles
      // 整組替換掉的話，React會認為是一個全新的狀態，會導致頁面重新渲染。
      // 用 concat 與 spread operator 追加數據，React 就只會處理新加入的部分，達成 lazy loading。
      uiState[target].data = [...uiState[target].data, ...newArticles]
    } else {
      uiState[target].data = response.data
    }
  } catch (error) {
    console.error('Error fetching :', error)
  }
}

export const getOneHandler = async (api, id, target) => {
  try {
    const response = await axios.get(`${api}/${id}`)
    uiState[target].data = response.data
  } catch (error) {
    console.error('Error fetching :', error)
  }
}

export const deleteHandler = async (api, id, onRefresh) => {
  try {
    await axios.delete(`${api}/${id}`)
    if (onRefresh) {
      onRefresh()
    }
    uiState.confirmModal.id && (uiState.confirmModal.id = null)
    toastHandler('success', 'success')
  } catch (error) {
    toastHandler('failed', 'error')
    console.error('Failed to delete :', error)
  }
}
