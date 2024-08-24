import axios from 'axios'
import { toastHandler } from './valtioAction'

export const uploadToS3 = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post('/api/articles/image', formData)
    toastHandler('upload successfully', 'success')

    return response.data.url
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data.error)
      return toastHandler(error.response.data.error, 'error')
    } else {
      console.error('An unexpected error occurred:', error.message)
    }
  }
}
