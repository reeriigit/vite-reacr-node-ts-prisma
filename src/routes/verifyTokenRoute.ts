// src/routes/verifyTokenRoute.ts
import { Response, Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// Middleware for token verification and user data retrieval
router.get('/verifyToken', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, user: req.user }); // Return decoded user data
});

export default router;
