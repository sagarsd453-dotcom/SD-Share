import morgan from 'morgan';

// We use morgan for standard request logging
// In a production environment, you might want to log to a file or a logging service
export const requestLogger = morgan('dev');
