import { NextResponse } from 'next/server'
import sequelize from '../../../../db_connection'
import { DataTypes } from 'sequelize'

import initArticleModel from '../../../../models/article'

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
