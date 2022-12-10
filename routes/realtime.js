const app = require("../app");
module.exports = (messageSocket) => {
  app.use("/api-v1", messageSocket);
};
