var express = require("express");
const jwt = require("../middlewares/jwt");
const usersControllers = require("../controllers/users.controllers");
var router = express.Router();

/* GET users listing. */
router.get("/users", jwt.verifyAccessToken, usersControllers.getUsers);
router.get("/users/q", jwt.verifyAccessToken, usersControllers.findUsers);
router.put("/user", jwt.verifyAccessToken, usersControllers.updateUser);

module.exports = router;
