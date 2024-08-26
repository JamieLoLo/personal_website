import { NextResponse } from 'next/server'
import sequelize from '../../../db_connection'
import { DataTypes } from 'sequelize'

import initArticleModel from '../../../models/article'
import { requireAdminSession } from '@/lib/auth'

const Article = initArticleModel(sequelize, DataTypes)

export async function GET() {
  try {
    const articles = await Article.findAll()

    // 格式化日期
    const formattedArticles = articles.map((article) => {
      const date = new Date(article.createdAt)
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      article.dataValues.createdAt = new Intl.DateTimeFormat(
        'en-US',
        options
      ).format(date)
      return article
    })

    return NextResponse.json(formattedArticles)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  // 驗證管理者身份
  const authResult = await requireAdminSession()
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const { title, content, coverImage, categoryId } = await req.json()

    const article = await Article.create({
      title,
      content,
      coverImage,
      categoryId,
    })
    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}
