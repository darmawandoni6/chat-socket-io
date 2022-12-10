const Sequelize = require("sequelize");
const db = require("../configs/config.db");

const { DataTypes } = Sequelize;

const Rooms = db.define(
  "rooms",
  {
    name: {
      type: DataTypes.STRING(16),
    },
    type: {
      type: DataTypes.ENUM,
      values: ["grub", "private"],
    },
  },
  { freezeTableName: true }
);

module.exports = Rooms;
