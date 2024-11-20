// src/routes/productRoutes.ts
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import multer from 'multer';
import { createProductController,getAllProductsController,deleteProductControllter,getProductByIdController } from '../controllers/product/productController';
import { updateProductController } from '../controllers/product/productController';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/images/products');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

router.post('/insert',authenticateToken, upload.array('images', 10), createProductController as any); // Type assertion to resolve TypeScript overload issue
router.get('/selectall',authenticateToken, getAllProductsController);
router.delete('/delete/:product_id',authenticateToken,deleteProductControllter);
router.get('/:product_id',authenticateToken, getProductByIdController);
router.put('/update/:product_id', upload.array('images', 10),authenticateToken, updateProductController);
export default router;
