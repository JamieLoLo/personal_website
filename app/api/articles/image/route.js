import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuid } from 'uuid'
import { shortenUrlWithTinyURL } from '@/lib/shortenUrl'
import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

async function uploadImageToS3(file, fileName, type) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}-${fileName}`,
    Body: file,
    ContentType: type,
  }

  const command = new PutObjectCommand(params)
  await s3Client.send(command)

  const getCommand = new GetObjectCommand(params)
  const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 })

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
    const fileExtension = mimeType.split('/')[1]
    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadImageToS3(
      buffer,
      uuid() + '.' + fileExtension,
      mimeType
    )

    // 缩短URL
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
