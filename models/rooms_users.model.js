const { DataTypes } = require("sequelize");
const db = require("../configs/config.db");

const Rooms_users = db.define(
  "rooms_users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.ENUM,
      values: ["user", "admin"],
      defaultValue: "user",
    },
  },
  { freezeTableName: true }
);

module.exports = Rooms_users;
