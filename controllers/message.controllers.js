const createError = require("http-errors");
const response = require("../helpers/response");
const messageService = require("../services/message.service");

module.exports = {
  getMessage: async (req, res, next) => {
    try {
      const { roomId } = req.params;
      const { data, error } = await messageService.get({ roomId });
      if (error) throw createError.BadRequest(error);

      const resData = data.map((item) => ({
        ...item.toJSON().user,
        chat: {
          id: item.toJSON().id,
          message: item.toJSON().message,
          createdAt: item.toJSON().createdAt,
          updatedAt: item.toJSON().updatedAt,
        },
      }));
      response({ res, status: 200, message: "success", data: resData });
    } catch (error) {
      next(error);
    }
  },
};
