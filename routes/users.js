var express = require("express");
const jwt = require("../middlewares/jwt");
const usersControllers = require("../controllers/users.controllers");
var router = express.Router();

/* GET users listing. */
router.get("/users", jwt.verifyAccessToken, usersControllers.getUsers);

module.exports = router;
