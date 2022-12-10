const express = require("express");
const response = require("../helpers/response");
const jwt = require("../middlewares/jwt");
const messageService = require("../services/message.service");
var router = express.Router();

module.exports = (io) => {
  router.post("/send", jwt.verifyAccessToken, async (req, res, next) => {
    try {
      const { message } = req.body;
      const { chat, roomId } = message;
      const { id: userId } = req.payload;

      const payload = {
        message: chat.message,
        roomId,
        userId,
      };

      const { data, error } = await messageService.create(payload);
      if (data) {
        console.log("hit 1x", roomId, req.body);
        io.emit(`receive_message-${roomId}`, req.body);
      }
      response({ res, status: 200, data: req.body });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
