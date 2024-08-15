const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gymsoft', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
