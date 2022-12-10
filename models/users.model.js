const Sequelize = require("sequelize");
const db = require("../configs/config.db");

const { DataTypes } = Sequelize;

const Users = db.define(
  "users",
  {
    name: {
      type: DataTypes.STRING(16),
    },
    email: {
      type: DataTypes.STRING(50),
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true }
);

module.exports = Users;
