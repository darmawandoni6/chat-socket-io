module.exports = (app) => {
  const auth = require("./auth");
  const rooms = require("./rooms");
  const message = require("./message");
  const users = require("./users");

  const v1 = "/api-v1";
  app.use(`${v1}/auth`, auth);
  app.use(v1, rooms);
  app.use(v1, message);
  app.use(v1, users);
};
