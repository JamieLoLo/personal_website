import axios from 'axios'

export async function shortenUrlWithTinyURL(longUrl) {
  try {
    const response = await axios.post(
      'https://api.tinyurl.com/create',
      {
        url: longUrl,
        domain: 'tinyurl.com',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TINYURL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data.data.tiny_url
  } catch (error) {
    console.error('Error shortening URL with TinyURL:', error)
    throw error
  }
}
