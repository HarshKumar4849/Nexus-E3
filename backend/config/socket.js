const { Server } = require("socket.io");
const { socketHandler } = require("../controllers/socketController");

function initSocket(server, allowedOrigins) {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  socketHandler(io);
}

module.exports = { initSocket };
