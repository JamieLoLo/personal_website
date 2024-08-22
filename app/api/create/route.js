import { NextResponse } from 'next/server'
import sequelize from '../../../db_connection'
import { DataTypes } from 'sequelize'

import initArticleModel from '../../../models/article'
const Article = initArticleModel(sequelize, DataTypes)

export async function POST(req) {
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
