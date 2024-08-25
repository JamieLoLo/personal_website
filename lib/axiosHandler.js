import axios from 'axios'
import { uiState } from './valtioState'
import { toastHandler } from './valtioAction'

export const getAllHandler = async (api, target) => {
  try {
    const response = await axios.get(api)
    uiState[target].data = response.data
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
