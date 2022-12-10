const { DataTypes } = require("sequelize");
const db = require("../configs/config.db");

const Messages = db.define(
  "messages",
  {
    message: {
      type: DataTypes.TEXT,
    },
    replyId: {
      type: DataTypes.INTEGER,
    },
  },
  { freezeTableName: true }
);

module.exports = Messages;
