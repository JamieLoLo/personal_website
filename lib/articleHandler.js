import axios from 'axios'
import { toastHandler } from './valtio'

export const deleteHandler = async (id, router, onRefresh) => {
  try {
    await axios.delete(`/api/articles/${id}`)
    router.push('/blog')
    if (onRefresh) {
      onRefresh()
    }
    toastHandler('success', 'success')
  } catch (error) {
    toastHandler('failed', 'error')
    console.error('Failed to delete article:', error)
  }
}
