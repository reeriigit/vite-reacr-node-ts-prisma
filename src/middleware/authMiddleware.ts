// Middleware for token verification and setting req.user
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../dbconnect/db';

export interface AuthenticatedRequest extends Request {
  user?: { userId: number; email: string; storeIds?: number[] };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ error: "No token provided or invalid token format" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { userId: number; email: string };
    req.user = { userId: decoded.userId, email: decoded.email };

    // Fetch associated storeIds for the user
    const stores = await prisma.stores.findMany({
      where: { user_id: decoded.userId },
      select: { storeId: true },
    });

    // Add storeIds to req.user
    req.user.storeIds = stores.map(store => store.storeId);
    next();
  } catch (error) {
    res.status(403).json({ error: "Token verification failed" });
  }
};

    