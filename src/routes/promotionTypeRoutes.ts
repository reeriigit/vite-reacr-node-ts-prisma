import express from 'express';
import { getAllPromotionTypesController } from '../controllers/promotype/promotionTypeController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Route to get all promotion types
router.get('/select',authenticateToken, getAllPromotionTypesController);

export default router;
