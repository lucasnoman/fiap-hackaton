import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  name: string;
  email: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

export const authenticateMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    res.status(401).json({ message: 'Token is required' });
    return;
  }

  try {
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'default-secret') as User;
    
    
    req.user = decoded;
    next(); 
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};
