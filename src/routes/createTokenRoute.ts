// src/routes/createTokenRoute.ts
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/createToken', (req: Request, res: Response) => {
  try {
    const payload = {
      user_id: 100,
      username: 'kob',
      usertype: 'admin'
    };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET!, { expiresIn: '1d' });
    res.send({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).send({ error: "Error generating token" });
  }
});

export default router;
