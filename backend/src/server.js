import http from 'http';
import app from './app.js';
import { setupSocket } from './socket/index.js';
import config from './config/index.js';

const server = http.createServer(app);

// Setup Socket.IO
setupSocket(server);

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port} in ${config.nodeEnv} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});
