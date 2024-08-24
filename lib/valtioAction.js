import { uiState } from './valtioState'

export const toastHandler = (message, status) => {
  uiState.toast.toastVisible = true
  uiState.toast.message = message
  uiState.toast.status = status

  setTimeout(() => {
    uiState.toast.toastVisible = false
  }, 3000)
}
