const usersService = require("../services/users.service");
const createError = require("http-errors");
const response = require("../helpers/response");
const { Op } = require("sequelize");

module.exports = {
  getUsers: async (req, res, next) => {
    try {
      const { id } = req.payload;
      const { data, error } = await usersService.findAll({
        id: {
          [Op.not]: id,
        },
      });
      if (error) throw createError.BadRequest(error);

      response({ res, status: 200, message: "success", data });
    } catch (error) {
      next(error);
    }
  },
};
