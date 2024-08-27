'use strict'

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Articles', 'cover_image_description', {
      type: Sequelize.TEXT,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Articles', 'cover_image_description', {
      type: Sequelize.STRING,
    })
  },
}
