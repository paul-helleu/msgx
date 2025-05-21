import { Server } from "socket.io";

const port = Number(process.env.SERVER_SOCKET_PORT) || 3300;
const io = new Server(port, {
  cors: { origin: process.env.SERVER_CLIENT_URI! },
});

interface Message {
  receiver: string;
  sender: string;
  date: Date;
  content: string;
}

io.on("connection", (socket) => {
  console.log(socket.id);
  const evIdentifier = `message/@bob`;
  const msgExample: Message = {
    receiver: "Bob",
    sender: "Alice",
    content: "Hello world!",
    date: new Date(Date.now()),
  };

  socket.emit(evIdentifier, msgExample);
  socket.on(evIdentifier, (msg) => {
    // store inside the database
    return socket.emit(evIdentifier, msg); // successfully saved into the database
  });
});
