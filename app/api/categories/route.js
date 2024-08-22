import { NextResponse } from 'next/server'
import sequelize from '../../../db_connection'
import { DataTypes } from 'sequelize'

import initCategoryModel from '../../../models/category'

const Category = initCategoryModel(sequelize, DataTypes)

export async function GET() {
  try {
    const categories = await Category.findAll()
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
