import { NextResponse } from 'next/server'
import sequelize from '../../../db_connection'
import { DataTypes } from 'sequelize'

import initArticleModel from '../../../models/article'
import { requireAdminSession } from '@/lib/auth'

const Article = initArticleModel(sequelize, DataTypes)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('params')
  const limit = parseInt(searchParams.get('limit') || '8')
  const offset = parseInt(searchParams.get('offset') || '0')

  const queryOptions = {
    order: [['createdAt', 'DESC']], // 按照 createdAt 降序排列
    limit,
    offset,
  }

  // 透過分類搜尋文章
  if (categoryId) {
    queryOptions.where = { categoryId }
  }

  try {
    // 查詢符合條件的文章
    const articles = await Article.findAll(queryOptions)

    // 查詢所有文章的總數（不設限於類別）
    const totalArticlesCount = await Article.count()

    // 格式化日期並生成預覽內容
    const formattedArticles = articles.map((article) => {
      const date = new Date(article.createdAt)
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      article.dataValues.createdAt = new Intl.DateTimeFormat(
        'en-US',
        options
      ).format(date)

      // 生成預覽內容
      const contentWithoutTags = article.content
        .replace(/<[^>]*>(.*?)<\/[^>]*>/g, '') // 移除標籤與內容
        .replace(/---+/g, '') // 移除 markdown 的分隔線

      // 預覽 40 字
      article.dataValues.previewContent =
        contentWithoutTags.trim().length > 40
          ? contentWithoutTags.trim().slice(0, 40) + '...'
          : contentWithoutTags.trim()

      return article
    })

    return NextResponse.json({
      articles: formattedArticles,
      totalArticlesCount,
    })
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
    const { title, content, coverImage, coverImageDescription, categoryId } =
      await req.json()

    const article = await Article.create({
      title,
      content,
      coverImage,
      coverImageDescription,
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
