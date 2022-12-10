const { Op } = require("sequelize");
const Users = require("../models/users.model");

module.exports = {
  findAll: async (where) => {
    try {
      const data = await Users.findAll({
        where,
        attributes: ["id", "name", "email", "createdAt", "updatedAt"],
      });
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  findOne: async (where) => {
    try {
      const data = await Users.findOne({ where });
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  create: async (data) => {
    try {
      await Users.create(data);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
  update: async (payload, where) => {
    try {
      await Users.update(payload, { where });
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
};
