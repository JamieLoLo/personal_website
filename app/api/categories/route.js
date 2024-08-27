import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth'
import sequelize from '../../../db_connection'
import { DataTypes } from 'sequelize'
import initCategoryModel from '../../../models/category'
import initArticleModel from '../../../models/article'

const Category = initCategoryModel(sequelize, DataTypes)
const Article = initArticleModel(sequelize, DataTypes)

Category.associate({ Article })
Article.associate({ Category })

export async function GET() {
  try {
    const categories = await Category.findAll({
      include: [{ model: Article }],
    })

    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
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
    const { name } = await req.json()
    const category = await Category.create({
      name,
    })
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
