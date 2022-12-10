var express = require("express");
const messageControllers = require("../controllers/message.controllers");
const jwt = require("../middlewares/jwt");
var router = express.Router();

/* GET users listing. */
router.get(
  "/message/:roomId",
  jwt.verifyAccessToken,
  messageControllers.getMessage
);

module.exports = router;
