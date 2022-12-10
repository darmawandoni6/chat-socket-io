const createError = require("http-errors");
const response = require("../helpers/response");
const messageService = require("../services/message.service");

module.exports = {
  getMessage: async (req, res, next) => {
    try {
      const { roomId } = req.params;
      const { data, error } = await messageService.findAll({ roomId });
      if (error) throw createError.BadRequest(error);

      response({ res, status: 200, message: "success", data });
    } catch (error) {
      next(error);
    }
  },
};
