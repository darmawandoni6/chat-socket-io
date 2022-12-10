const Messages = require("../models/messages.model");

module.exports = {
  findAll: async (where) => {
    try {
      const data = await Messages.findAll({
        where,
        order: [["updatedAt", "DESC"]],
        include: [
          {
            model: Messages,
            as: "reply",
          },
        ],
      });
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  create: async (payload) => {
    try {
      const data = await Messages.create(payload);
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
};
