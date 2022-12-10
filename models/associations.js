const Rooms = require("./rooms.model");
const Rooms_users = require("./rooms_users.model");
const Users = require("./users.model");

// Users.hasMany(Contacts);

Rooms.belongsToMany(Users, { through: Rooms_users });
Users.belongsToMany(Rooms, { through: Rooms_users });

// Rooms_users.hasMany(Rooms, { through: Rooms_users });

// Rooms.hasMany(Messages);

// Users.hasMany(Rooms);
// Users.hasOne(Messages);

// Messages.belongsTo(Users);
// Messages.belongsTo(Rooms);
