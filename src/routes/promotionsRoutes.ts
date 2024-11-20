import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getPromotionById,
  createPromotionController,
  getAllPromotions,
  updatePromotionController,
  getPromotionsByStoreId,
} from '../controllers/promotions/promotionsController';
import { deletePromotionsController } from '../controllers/promotions/promotionsController';

const router = Router();


// ตั้งค่าที่จัดเก็บไฟล์รูปภาพ
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "src/uploads/images/promotions/"); // โฟลเดอร์ที่เก็บไฟล์
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // ชื่อไฟล์
    },
  });
  
  const upload = multer({ storage });

// Route to create a new promotion with image upload
router.post(
    "/insert",
    authenticateToken,
    upload.single("proimage"), // รองรับการอัปโหลดไฟล์
    createPromotionController
  );

// Route to get all promotions
router.get('/selects', authenticateToken, getAllPromotions);

// Route to update a promotion by ID
router.put('/update/:promo_id', authenticateToken, upload.single('proimage'), updatePromotionController);

router.delete('/delete/:promo_id', authenticateToken, deletePromotionsController);
// Route to get a promotion by ID
router.get('/select/:promo_id', authenticateToken, getPromotionById);
// Route สำหรับดึงข้อมูล Promotions ทั้งหมด เฉพาะ Store ID
router.get("/selectbystore",authenticateToken, getPromotionsByStoreId);

export default router;
