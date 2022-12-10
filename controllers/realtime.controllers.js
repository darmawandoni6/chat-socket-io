const express = require("express");
const createError = require("http-errors");
const response = require("../helpers/response");
const jwt = require("../middlewares/jwt");
const messageService = require("../services/message.service");
var router = express.Router();

module.exports = (io) => {
  router.post("/send", jwt.verifyAccessToken, async (req, res, next) => {
    try {
      const { message, roomId, unixMessage, replyId } = req.body;
      const { id } = req.payload;

      const payload = {
        message,
        roomId,
        userId: id,
        replyId,
      };

      const { data, error } = await messageService.create(payload);
      if (error) throw createError.BadRequest(error);

      const resPayload = {
        ...req.payload,
        chat: data,
        unixMessage,
      };
      io.emit(`receive_message-${roomId}`, resPayload);
      response({ res, status: 200, data: resPayload });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
