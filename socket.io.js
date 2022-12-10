const { Server } = require("socket.io");
module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.URL_FRONT,
      methods: ["GET", "POST"],
    },
  });
  const messageSocket = require("./controllers/realtime.controllers")(io);
  require("./routes/realtime")(messageSocket);

  io.on("connection", (socket) => {
    socket.on("join_room", (room) => {
      socket.join(room);
    });

    socket.on("send_message", (data) => {
      io.to(data.room).emit("receive_message", { ...data });
    });

    socket.on("chat message", (msg) => {
      io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
