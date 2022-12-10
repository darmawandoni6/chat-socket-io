const db = require("../configs/config.db");
const Messages = require("../models/messages.model");
const Rooms = require("../models/rooms.model");
const Rooms_users = require("../models/rooms_users.model");
const Users = require("../models/users.model");

module.exports = {
  create: async (payload) => {
    try {
      const data = await Rooms.create(payload);
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  addRoom: async (payload, payloadUsers, admin) => {
    try {
      await db.transaction(async (transaction) => {
        const room = await Rooms.create(payload, { transaction });
        const res = payloadUsers.map((item) => ({
          roomId: room.id,
          userId: item,
          role: item === admin ? "admin" : "user",
        }));
        await Rooms_users.bulkCreate(res, { transaction });
      });
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
  listRoom: async (where) => {
    try {
      const data = await Rooms.findAll({
        include: [
          {
            model: Users,
            attributes: [],
            where,
          },
        ],
      });
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  openRoom: async (where) => {
    try {
      const data = await Rooms.findOne({
        where,
        include: [
          {
            model: Users,
            attributes: ["id", "name", "email"],
            through: {
              attributes: [],
            },
          },
        ],
      });
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  update: async (where, payload) => {
    try {
      await Rooms.update(payload, { where });
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
};
