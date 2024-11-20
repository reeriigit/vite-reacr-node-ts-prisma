import { Response } from 'express';
import { prisma } from '../../dbconnect/db';
import bcrypt from 'bcrypt';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { TypedRequestBody } from '../../model/genirict.type';
import { User } from '../../model/UserModel';
import { createUserService, getUserDataService } from '../../services/userService';

const SALT_ROUNDS = 10;

// Controller to get user data
export const getUserDataController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(403).json({ success: false, message: "User ID not found in token" });
      return;
    }

    const user = await getUserDataService(req.user.userId);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ success: false, error: "Database query error" });
  }
};

// Controller to create a new user
export const createUserController = async (req: TypedRequestBody<User>, res: Response): Promise<void> => {
  const { referral_code, referred_by, username, email, password, fullname, address, phone_number, usertype_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await createUserService({
      referral_code,
      referred_by,
      username,
      email,
      password: hashedPassword,
      fullname,
      address,
      phone_number,
      usertype_id,
    });

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error("Database insert error:", error);
    res.status(500).json({ success: false, error: "Database insert error" });
  }
};
