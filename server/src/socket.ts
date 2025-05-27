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

io.on("connection", async (socket) => {
  socket.on("message", async (msg: IMessage) => {
    console.log(msg);
    socket.emit(msg.receiver, msg);

    if (msg.sender === msg.receiver) {
      // error
      return;
    }

    const sender = await userRepository.findByUsername(msg.sender);
    if (sender === null) {
      // error
      return;
    }

    const receiver = await userRepository.findByUsername(msg.sender);
    if (receiver === null) {
      // error
      return;
    }
  });
});
