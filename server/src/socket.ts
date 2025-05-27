import { Server } from "socket.io";
import type { IMessage } from "./interfaces/IMessage";
import Message from "./database/models/Message";
import conversationRepository from "./database/repositories/conversation.repository";
import userRepository from "./database/repositories/user.repository";

const port = Number(process.env.SERVER_SOCKET_PORT) || 3300;
const io = new Server(port, {
  cors: { origin: process.env.SERVER_CLIENT_URI! },
});

const getSocketCode = (receiver: string) => receiver;
const getConversationId = () => 1;

io.on("connection", (socket) => {
  socket.on("joinChannel", (channelId) => {
    socket.join(channelId);
  });

  socket.on("sendMessage", ({ channelId, message, senderId }) => {
    const payload = {
      channelId,
      senderId,
      message,
    };
    io.to(channelId).emit("newMessage", payload);
  });
  // socket.on("channels/1", (msg: IMessage) => {});
});
