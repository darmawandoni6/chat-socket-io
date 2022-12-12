var express = require("express");
const authControllers = require("../controllers/auth/auth.controllers");
const jwt = require("../middlewares/jwt");
var router = express.Router();

/* GET users listing. */
router.get("/", jwt.verifyAccessToken, authControllers.auth);
router.post("/register", authControllers.register);
router.post("/login", authControllers.login);
router.post("/forgot-password", authControllers.forgotPassword);
router.post("/log-out", authControllers.logOut);

module.exports = router;
