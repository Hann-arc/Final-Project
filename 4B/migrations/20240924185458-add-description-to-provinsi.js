'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   queryInterface.addColumn('provinsis', 'description',{
    type: Sequelize.STRING,
    allowNull:true
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('provinsis', 'description')
  }
};
