const Messages = require("./messages.model");
const Rooms = require("./rooms.model");
const Rooms_users = require("./rooms_users.model");
const Users = require("./users.model");

Rooms.belongsToMany(Users, { through: Rooms_users });
Users.belongsToMany(Rooms, { through: Rooms_users });

Rooms.hasMany(Messages);
Users.hasOne(Messages);
Messages.belongsTo(Messages, {
  foreignKey: {
    name: "replyId",
    allowNull: true,
  },
  as: "reply",
});
