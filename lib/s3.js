import axios from 'axios'

export const uploadToS3 = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post('/api/image', formData)
    return response.data.url
  } catch (error) {
    console.error('Failed to upload image:', error)
    throw new Error('Failed to upload image')
  }
}
