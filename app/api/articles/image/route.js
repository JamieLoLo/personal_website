import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuid } from 'uuid'
import { shortenUrlWithTinyURL } from '@/lib/shortenUrl'
import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth'

// AWS SDK S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

async function uploadImageToS3(file, type) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}-${uuid()}`,
    Body: file,
    ContentType: type,
    ACL: 'public-read',
  }

  const command = new PutObjectCommand(params)
  await s3Client.send(command)

  const url = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`

  return url
}

export async function POST(req) {
  // 驗證管理者身份
  const authResult = await requireAdminSession()
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return new Response(JSON.stringify({ error: 'File blob is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const mimeType = file.type
    const buffer = Buffer.from(await file.arrayBuffer()) // Buffer 是 Node.js 中用來處理二進制數據的對象
    const url = await uploadImageToS3(buffer, mimeType)

    // 縮短URL
    const shortUrl = await shortenUrlWithTinyURL(url)

    return new Response(JSON.stringify({ success: true, url: shortUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return new Response(JSON.stringify({ message: 'Error uploading image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
