import { Express, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import session from 'express-session';
import { storage } from './storage';
import { loginSchema, Cinema } from '@shared/schema';

// JWT secret should be an environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = '24h';
// Session secret should be an environment variable in production
const SESSION_SECRET = process.env.SESSION_SECRET || 'your_session_secret_key';

// Extend Express Request interface to include cinema
declare global {
  namespace Express {
    interface Request {
      cinema?: Omit<Cinema, 'mot_de_passe'>;
    }
  }
}

// Authenticate cinema login and generate JWT
export async function authenticateCinema(req: Request, res: Response) {
  try {
    // Validate request body
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.error.errors
      });
    }
    
    const { login, mot_de_passe } = validation.data;
    
    // Find cinema by login
    const cinema = await storage.getCinemaByLogin(login);
    if (!cinema) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: 'AUTH_FAILED'
      });
    }
    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(mot_de_passe, cinema.mot_de_passe);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: 'AUTH_FAILED'
      });
    }
    
    // Generate JWT
    const { mot_de_passe: _, ...cinemaWithoutPassword } = cinema;
    const token = jwt.sign({ cinema: cinemaWithoutPassword }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });
    
    // Return token and cinema info
    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: {
        token,
        cinema: cinemaWithoutPassword
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during authentication',
      error: 'SERVER_ERROR'
    });
  }
}

// Middleware to verify JWT token
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
      error: 'AUTH_REQUIRED'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { cinema: Omit<Cinema, 'mot_de_passe'> };
    req.cinema = decoded.cinema;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: 'AUTH_FAILED'
    });
  }
}

// Verify JWT token and return cinema info
export function verifyCinema(req: Request, res: Response) {
  return res.status(200).json({
    success: true,
    message: 'Token is valid',
    data: {
      cinema: req.cinema
    }
  });
}

// Hash password function for creating/updating cinemas
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Setup auth routes
export function setupAuth(app: Express) {
  // Setup session
  const sessionSettings: session.SessionOptions = {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  };

  app.set('trust proxy', 1);
  app.use(session(sessionSettings));

  // Login route
  app.post('/api/auth/login', authenticateCinema);
  
  // Token verification route
  app.get('/api/auth/verify', verifyToken, verifyCinema);
}
