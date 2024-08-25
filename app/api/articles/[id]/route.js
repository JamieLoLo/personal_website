import { NextResponse } from 'next/server'
import sequelize from '../../../../db_connection'
import { DataTypes } from 'sequelize'

import initArticleModel from '../../../../models/article'
import { requireAdminSession } from '@/lib/auth'

const Article = initArticleModel(sequelize, DataTypes)

export async function GET(req, { params }) {
  try {
    const article = await Article.findByPk(params.id)
    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

export async function PUT(req, { params }) {
  // 驗證管理者身份
  const authResult = await requireAdminSession()
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  const { title, content, coverImage, categoryId } = await req.json()

  try {
    const article = await Article.findByPk(params.id)
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    article.update({ title, content, coverImage, categoryId })
    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Error fetching upload article:', error)
    return NextResponse.json(
      { error: 'Failed to upload article' },
      { status: 500 }
    )
  }
}

export async function DELETE(req, { params }) {
  // 驗證管理者身份
  const authResult = await requireAdminSession()
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const article = await Article.findByPk(params.id)
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    article.destroy()
    return NextResponse.json(article)
  } catch (error) {
    console.error('Failed to delete article:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}
