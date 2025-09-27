// models/Item.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.STRING,
  price: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
}, {
  tableName: 'items'
});

module.exports = Item;
