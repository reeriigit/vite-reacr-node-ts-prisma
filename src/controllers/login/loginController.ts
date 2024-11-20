// src/controllers/loginController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../../dbconnect/db';
import { LoginRequest } from '../../model/LoginModel';

export const loginUser = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { userId: user.user_id, email: user.email },
        process.env.TOKEN_SECRET!,
        { expiresIn: '1h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // ใช้ secure cookie ใน production
        maxAge: 24 * 60 * 60 * 1000, // 1 วัน
      });

      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ success: false, message: "Database query error" });
  }
};
