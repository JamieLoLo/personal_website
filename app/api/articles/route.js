import { NextResponse } from 'next/server'
import sequelize from '../../../db_connection'
import { DataTypes } from 'sequelize'

import initArticleModel from '../../../models/article'

const Article = initArticleModel(sequelize, DataTypes)

export async function GET() {
  try {
    const articles = await Article.findAll()
    return NextResponse.json(articles)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}
