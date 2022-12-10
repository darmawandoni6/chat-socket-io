const Sequelize = require("sequelize");
const db = require("../configs/config.db");

const { DataTypes } = Sequelize;

const Contacts = db.define(
  "contacts",
  {
    name: {
      type: DataTypes.STRING(16),
    },
  },
  { freezeTableName: true }
);

module.exports = Contacts;
