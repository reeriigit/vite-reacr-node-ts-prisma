// src/routes/userRoutes.ts
import { Router, Response } from "express";
import { prisma } from "../dbconnect/db";
import { TypedRequestBody } from "../model/genirict.type";
import { User } from "../model/UserModel";
import bcrypt from 'bcrypt';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();
const SALT_ROUNDS = 10;

// Route to get a specific user's data, protected by token
router.get("/data", authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(403).json({ success: false, message: "User ID not found in token" });
      return;
    }
   console.log("data userId",req.user.userId )

    const user = await prisma.users.findUnique({
      where: { user_id: req.user.userId },
      select: {
        user_id: true,
        email: true,
        usertype_id: true,

      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ success: false, error: "Database query error" });
  }
});

// Route to create a new user
router.post("/create", async (req: TypedRequestBody<User>, res: Response): Promise<void> => {
  const {
    referral_code,
    referred_by,
    username,
    email,
    password,
    fullname,
    address,
    phone_number,
    usertype_id,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await prisma.users.create({
      data: {
        referral_code,
        referred_by,
        username,
        email,
        password: hashedPassword,
        fullname,
        address,
        phone_number,
        usertype_id,
      },
    });
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error("Database insert error:", error);
    res.status(500).json({ success: false, error: "Database insert error" });
  }
});

export default router;
