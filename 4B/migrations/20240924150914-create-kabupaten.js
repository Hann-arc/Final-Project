'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kabupatens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      diresmikan: {
        type: Sequelize.DATEONLY
      },
      image: {
        type: Sequelize.STRING
      },
      provinsi_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "provinsis",
          key: "id" 
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },

      bupati: {
        type: Sequelize.STRING
      },
      populasi: {
        type: Sequelize.BIGINT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('kabupatens');
  }
};