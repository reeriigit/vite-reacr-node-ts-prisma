// src/routes/loginRoutes.ts
import { Router } from 'express';
import { loginUser } from '../controllers/login/loginController';

const router = Router();

// เส้นทางสำหรับ login
router.post('/login', loginUser);

export default router;
