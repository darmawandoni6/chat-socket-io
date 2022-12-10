const db = require("../configs/config.db");
const Rooms_users = require("../models/rooms_users.model");

module.exports = {
  findOne: async (where) => {
    try {
      const data = await Rooms_users.findOne({ where });
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  bulkCreate: async (payload) => {
    try {
      await Rooms_users.bulkCreate(payload);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
  remove: async (where, newAdmin) => {
    try {
      await db.transaction(async (transaction) => {
        await Rooms_users.destroy({ where, transaction });
        if (newAdmin) {
          await Rooms_users.update(
            { role: "admin" },
            { where: { id: newAdmin.id }, transaction }
          );
        }
      });
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
  findAll: async (where) => {
    try {
      const data = await Rooms_users.findAll({ where });
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
};
