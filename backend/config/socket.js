const { Server } = require("socket.io");
const { socketHandler } = require("../controllers/socketController");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  socketHandler(io);
}

module.exports = { initSocket, getIO: () => io };
