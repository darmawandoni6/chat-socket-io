const Sequelize = require("sequelize");
const db = require("../configs/config.db");
const Rooms = require("./rooms.model");

const { DataTypes } = Sequelize;

const Messages = db.define(
  "messages",
  {
    message: {
      type: DataTypes.TEXT,
    },
  },
  { freezeTableName: true }
);

module.exports = Messages;
