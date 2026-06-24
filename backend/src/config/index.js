import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

export default {
  port: process.env.PORT || 5000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development'
};
