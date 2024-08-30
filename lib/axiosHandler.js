import axios from 'axios'
import { uiState } from './valtioState'
import { toastHandler } from './valtioAction'

export const getAllHandler = async (
  api,
  target,
  params = {},
  resetData = false
) => {
  try {
    const response = await axios.get(api, { params })

    if (response.data.totalArticlesCount) {
      uiState[target].total = response.data.totalArticlesCount

      if (resetData) {
        // 這邊是需要整組資料替換的，像是用類別選取文章時。
        uiState[target].data = response.data.articles
      } else {
        // 這邊不能直接使用 uiState[target].data = response.data.articles
        // 整組替換掉的話，React會認為是一個全新的狀態，會導致頁面重新渲染。
        // 用 concat 與 spread operator 追加數據，React 就只會處理新加入的部分，達成 lazy loading。
        const existingIds = new Set(
          uiState[target].data.map((article) => article.id)
        )
        const newArticles = response.data.articles.filter(
          (newArticle) => !existingIds.has(newArticle.id)
        )
        uiState[target].data = [...uiState[target].data, ...newArticles]
      }
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
    getAllHandler('/api/articles', 'articles', {}, true)
  } catch (error) {
    toastHandler('failed', 'error')
    console.error('Failed to delete :', error)
  }
}
