import { NextResponse } from 'next/server'
import sequelize from '../../../../db_connection'
import { DataTypes } from 'sequelize'

import initCategoryModel from '../../../../models/category'
import initArticleModel from '../../../../models/article'
import { requireAdminSession } from '@/lib/auth'

const Category = initCategoryModel(sequelize, DataTypes)
const Article = initArticleModel(sequelize, DataTypes)

// export async function GET(req, { params }) {
// try {
//   const article = await Article.findByPk(params.id)
//   return NextResponse.json(article)
// } catch (error) {
//   console.error('Error fetching article:', error)
//   return NextResponse.json(
//     { error: 'Failed to fetch article' },
//     { status: 500 }
//   )
// }
// }

export async function PUT(req, { params }) {
  // 驗證管理者身份
  const authResult = await requireAdminSession()
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  const { name } = await req.json()

  try {
    const category = await Category.findByPk(params.id)
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    category.update({ name })
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error fetching upload category:', error)
    return NextResponse.json(
      { error: 'Failed to upload category' },
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
    const category = await Category.findByPk(Number(params.id))

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    const articles = await Article.findAll({
      where: { category_id: Number(params.id) },
    })
    if (articles.length > 0) {
      await Promise.all(
        articles.map(async (article) => {
          await article.update({ categoryId: null })
        })
      )
    }
    await category.destroy()
    return NextResponse.json(category)
  } catch (error) {
    console.error('Failed to delete category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
