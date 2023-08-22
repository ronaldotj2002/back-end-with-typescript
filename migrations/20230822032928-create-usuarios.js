'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
      nome: { 
          type: Sequelize.STRING(128),
          allowNull: false
      },
      email: {
          type: Sequelize.STRING(70),
          allowNull: false,
          unique: true
      },
      login: { 
          type: Sequelize.STRING(30),
          allowNull: false,
          unique: true
      },
      senha: {
          type: Sequelize.STRING(256),
          allowNull: false
      },
      createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: new Date()
      },
      updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: new Date()
      }
  });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
  }
};