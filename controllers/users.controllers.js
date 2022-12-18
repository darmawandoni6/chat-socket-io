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
  findUsers: async (req, res, next) => {
    try {
      const { search } = req.query;
      const { name } = req.payload;

      if (!search) {
        response({ res, status: 200, message: "success find data", data: [] });
        return;
      }
      const where = {
        name: {
          [Op.ne]: name,
        },

        [Op.or]: [
          {
            name: {
              [Op.substring]: search ?? "",
            },
          },
          {
            email: {
              [Op.substring]: search ?? "",
            },
          },
        ],
      };

      const { data, error } = await usersService.findAll(where);
      if (error) createError.BadRequest(error);

      response({ res, status: 200, message: "success find data", data });
    } catch (error) {
      next(error);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      const { name } = req.body;
      const { id } = req.payload;
      if (!name) throw createError.BadRequest("name is required");

      let result = { data: null, error: null };
      result = await usersService.findOne({
        name,
        id: {
          [Op.ne]: id,
        },
      });
      if (result.data) throw createError.Conflict("name already exist");
      if (result.error) throw createError.BadRequest(result.error);

      result = await usersService.update({ name }, { id });
      if (result.error) throw createError.BadRequest(result.error);

      response({ res, status: 200, message: "success update profile" });
    } catch (error) {
      next(error);
    }
  },
};
