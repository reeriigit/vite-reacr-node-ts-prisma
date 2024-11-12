// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: { userId: number; email: string }; // Define the structure of the decoded user data
}

// Middleware for token verification
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  console.log("my token ",authHeader)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: "No token provided or invalid token format" });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { userId: number; email: string };
    req.user = decoded; // Attach decoded user data to req.user
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(403).json({ error: "Token verification failed" });
  }
};
