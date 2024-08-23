import { proxy } from 'valtio'

export const uiState = proxy({
  toast: {
    visible: false,
    message: '',
    status: '',
  },
})

export const toastHandler = (message, status) => {
  uiState.toast.visible = true
  uiState.toast.message = message
  uiState.toast.status = status

  setTimeout(() => {
    uiState.toast.visible = false
  }, 3000)
}
