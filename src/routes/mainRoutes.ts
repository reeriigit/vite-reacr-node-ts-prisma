// src/routes/mainRoutes.ts
import { Request, Response, Router } from "express";
import { prisma } from "../dbconnect/db"; // เรียกใช้ prisma client แทน PoolCon

const router = Router();

// เส้นทางสำหรับ "/"
router.get("/", (req: Request, res: Response) => {
  res.json({ result: "this is my first typescript" });
});



export default router;
