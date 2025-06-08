import fs from 'fs';
import https from 'https';
import { Server } from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    username?: string;
  }
}

const PORT = Number(process.env.SERVER_SOCKET_PORT);
const SERVER_CLIENT_URI = process.env.SERVER_CLIENT_URI;

const httpsOptions = {
  key: fs.readFileSync('./certs/localhost-key.pem'),
  cert: fs.readFileSync('./certs/localhost.pem'),
};

const httpsServer = https.createServer(httpsOptions);

const io = new Server(httpsServer, {
  cors: {
    origin: SERVER_CLIENT_URI,
    credentials: true,
  },
});

httpsServer.listen(PORT);

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

  socket.on('conversationCreated', ({ participants, conversation }) => {
    participants.forEach((username: string) => {
      io.to(username).emit('new_conversation', conversation);
    });
  });

  socket.on('announce-presence', (username) => {
    socket.username = username;
    socket.join(username);
    socket.broadcast.emit('user-connected', username);
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      socket.broadcast.emit('user-disconnected', socket.username);
    }
  });
});
