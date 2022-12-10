const Messages = require("../models/messages.model");
const Rooms = require("../models/rooms.model");
const Users = require("../models/users.model");

module.exports = {
  create: async (payload) => {
    try {
      const data = await Messages.create(payload);
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  get: async (where) => {
    try {
      const data = await Messages.findAll({
        where,
        attributes: ["id", "message", "createdAt", "updatedAt"],
        include: [
          {
            model: Users,
            attributes: {
              exclude: ["password"],
            },
          },
          {
            model: Rooms,
            attributes: ["id", "name"],
          },
        ],
      });
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
};
