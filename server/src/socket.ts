import { Server } from "socket.io";

const port = Number(process.env.SERVER_SOCKET_PORT) || 3300;
const io = new Server(port, {
  cors: { origin: process.env.SERVER_CLIENT_URI! },
});

io.on("connection", (socket) => {
  socket.on("joinChannel", (channelId) => {
    socket.join(channelId);
  });

  socket.on("message", ({ channelId, message, senderId }) => {
    if (socket.rooms.has(channelId)) {
      const payload = {
        channelId,
        senderId,
        message,
      };
      io.to(channelId).emit("message", payload);
    } else {
      socket.emit("error", "You are not in this room");
    }
  });
});
