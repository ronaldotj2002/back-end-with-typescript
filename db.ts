import { Sequelize } from 'sequelize';
require('dotenv').config();

const sequelize = new Sequelize(`mariadb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
    dialect: 'mariadb',
});

export {
    sequelize
}