var express = require("express");
const jwt = require("../middlewares/jwt");
const roomsController = require("../controllers/rooms.controller");
var router = express.Router();

/* GET users listing. */
router.post("/room", jwt.verifyAccessToken, roomsController.createRoom);
router.put("/room/:id", jwt.verifyAccessToken, roomsController.editRoom);
router.delete(
  "/room/:id/users",
  jwt.verifyAccessToken,
  roomsController.removeUser
);
router.delete(
  "/room/:id/leave",
  jwt.verifyAccessToken,
  roomsController.leaveGrub
);
router.delete(
  "/room/:id/remove",
  jwt.verifyAccessToken,
  roomsController.removeRoom
);
router.post(
  "/room/invite/:roomId",
  jwt.verifyAccessToken,
  roomsController.inviteGrub
);
router.get("/room", jwt.verifyAccessToken, roomsController.listRoom);
router.get("/room/:id", jwt.verifyAccessToken, roomsController.openRoom);

module.exports = router;
