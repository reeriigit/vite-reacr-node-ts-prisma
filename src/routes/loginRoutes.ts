// src/routes/loginRoutes.ts
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../dbconnect/db';
import { LoginRequest } from '../model/LoginModel';

const router = Router();

router.post('/', async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      console.log("data login ",email,password)
      const token = jwt.sign(
        { userId: user.user_id, email: user.email },
        process.env.TOKEN_SECRET!,
        { expiresIn: '1d' }
      );
      res.json({ success: true, message: "Login successful", token });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ success: false, message: "Database query error" });
  }
});

export default router;
