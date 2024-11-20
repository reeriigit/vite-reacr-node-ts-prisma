// src/routes/productTypeRoutes.ts
import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/authMiddleware';
import {getProductTypeByIdController, createProductTypeController,getAllProductTypesController,deleteProductTypeController,updateProductTypeController  } from '../controllers/producttype/productTypeController';


const router = Router();

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/images/producttypes/'); // Directory to store images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// Route to create a new product type with image upload
router.post('/insert', authenticateToken, upload.single('producttype_image'), createProductTypeController);
// Route สำหรับดึงข้อมูล ProductTypes ทั้งหมดของ storeId นั้น
router.get('/selectofstore', authenticateToken, getAllProductTypesController);
// Delete product type by ID
router.delete('/deletes/:producttype_id', authenticateToken, deleteProductTypeController);

router.put('/update/:producttype_id', authenticateToken, upload.single('producttype_image'), updateProductTypeController);

router.get('/:producttype_id', authenticateToken, getProductTypeByIdController);

export default router;
