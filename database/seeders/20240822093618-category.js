'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Categories',
      [
        'Google',
        'JavaScript',
        'TypeScript',
        'React',
        'LeetCode',
        'Webpack5',
        '未分類',
      ].map((item) => {
        return {
          name: item,
          created_at: new Date(),
          updated_at: new Date(),
        }
      }),
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', {})
  },
}
