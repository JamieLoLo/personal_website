'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      Article.belongsTo(models.Category, { foreignKey: 'categoryId' })
    }
  }
  Article.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      coverImage: DataTypes.STRING,
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Article',
      tableName: 'Articles',
      underscored: true,
    }
  )
  return Article
}
