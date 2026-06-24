import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import config from './config/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { rateLimiter } from './middlewares/rateLimiter.js';
import { requestLogger } from './middlewares/logger.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use('/api', rateLimiter);

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// Future routes can be mounted here
// app.use('/api/rooms', roomRoutes);

// Error Handling Middleware (must be last)
app.use(errorHandler);

export default app;
