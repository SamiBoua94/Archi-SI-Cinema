import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Express } from 'express';

// CORS middleware
export const corsMiddleware = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [/\.cineapi\.com$/, /\.cineapi\.fr$/] // Restrict in production
    : '*', // Allow all in development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
});

// Error handling middleware
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
    error: 'SERVER_ERROR'
  });
}

// Not found middleware
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: 'The requested resource was not found',
    error: 'NOT_FOUND'
  });
}

// Setup all middlewares
export function setupMiddlewares(app: Express) {
  app.use(corsMiddleware);
  
  // These should be added after all routes
  app.use(notFoundHandler);
  app.use(errorHandler);
}
