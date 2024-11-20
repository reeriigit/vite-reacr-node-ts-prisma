import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getUserDataController, createUserController } from '../controllers/users/userController';

const router = Router();

// Route to get a specific user's data, protected by token
router.get("/data", authenticateToken, getUserDataController);
// Route to create a new user
router.post("/create", createUserController);

export default router;
