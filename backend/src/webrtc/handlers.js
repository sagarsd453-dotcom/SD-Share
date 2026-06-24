export const handleWebRTC = (socket) => {
  // SDP Offer
  socket.on('webrtc-offer', ({ roomCode, offer }) => {
    socket.to(roomCode).emit('webrtc-offer', {
      senderId: socket.id,
      offer
    });
  });

  // SDP Answer
  socket.on('webrtc-answer', ({ roomCode, answer }) => {
    socket.to(roomCode).emit('webrtc-answer', {
      senderId: socket.id,
      answer
    });
  });

  // ICE Candidates
  socket.on('ice-candidate', ({ roomCode, candidate }) => {
    socket.to(roomCode).emit('ice-candidate', {
      senderId: socket.id,
      candidate
    });
  });
};
