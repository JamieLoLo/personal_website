'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Articles', 'cover_image_description', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Articles', 'cover_image_description')
  },
}
