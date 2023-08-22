'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gastos', {
      id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
      titulo: { 
          type: Sequelize.STRING(50),
          allowNull: false
      },
      descricao: {
          type: Sequelize.STRING(128),
          allowNull: false
      },
      valor: { 
          type: Sequelize.INTEGER,
          allowNull: false
      },
      userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
              model: 'usuarios',
              key: 'id'
          }
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
    await queryInterface.dropTable('gastos');
  }
};