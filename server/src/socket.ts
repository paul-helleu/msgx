import { Server } from 'socket.io';
declare module 'socket.io' {
  interface Socket {
    username?: string;
  }
}

const port = Number(process.env.SERVER_SOCKET_PORT) || 3300;
const io = new Server(port, {
  cors: { origin: process.env.SERVER_CLIENT_URI! },
});

io.on('connection', (socket) => {
  socket.on('joinChannel', (channelId) => {
    socket.join(channelId);
  });

  socket.on('message', ({ channelId, message, senderId }) => {
    if (socket.rooms.has(channelId)) {
      const payload = {
        channelId,
        senderId,
        message,
      };
      io.to(channelId).emit('message', payload);
    } else {
      socket.emit('error', 'You are not in this room');
    }
  });

  socket.on('announce-presence', (username) => {
    socket.username = username;
    socket.broadcast.emit('user-connected', username);
  });

  socket.on('who-is-online', () => {
    socket.broadcast.emit('who-is-online-request', socket.id);
  });

  socket.on('i-am-online', ({ toSocketId, username }) => {
    io.to(toSocketId).emit('i-am-online', username);
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      socket.broadcast.emit('user-disconnected', socket.username);
    }
  });
});
