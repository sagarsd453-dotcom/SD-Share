import { Server } from 'socket.io';
import config from '../config/index.js';
import { handleWebRTC } from '../webrtc/handlers.js';

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: config.frontendUrl,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Room Management
    socket.on('join-room', ({ roomCode, mode }) => {
      // For V1, we enforce one sender, one receiver, but logic allows standard room joins
      const room = io.sockets.adapter.rooms.get(roomCode);
      const numClients = room ? room.size : 0;

      socket.join(roomCode);
      socket.currentRoom = roomCode;

      if (mode === 'sender') {
        socket.emit('room-created', roomCode);
        console.log(`User ${socket.id} joined as sender in ${roomCode}`);
        if (numClients > 0) {
          // If the sender joins and a receiver is already there (Sender re-join)
          socket.emit('peer-joined', 'existing-peer');
        }
      } else {
        socket.emit('room-joined', roomCode);
        socket.to(roomCode).emit('peer-joined', socket.id);
        console.log(`User ${socket.id} joined as receiver in ${roomCode}`);
      }
    });

    socket.on('leave-room', (roomCode) => {
      socket.leave(roomCode);
      if (socket.currentRoom === roomCode) socket.currentRoom = null;
      socket.to(roomCode).emit('peer-left', socket.id);
      console.log(`User ${socket.id} left room ${roomCode}`);
    });

    socket.on('delete-room', (roomCode) => {
      socket.to(roomCode).emit('room-deleted', roomCode);
      io.in(roomCode).socketsLeave(roomCode); // Force everyone out of the socket.io room
      console.log(`Room ${roomCode} deleted by creator ${socket.id}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      if (socket.currentRoom) {
        socket.to(socket.currentRoom).emit('peer-left', socket.id);
        console.log(`Broadcasted peer-left to room ${socket.currentRoom} for ${socket.id}`);
      }
    });

    // WebRTC Signaling Handlers
    handleWebRTC(socket);
  });
};
