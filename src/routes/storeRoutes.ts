import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/authMiddleware';
import { createStoreController, getStoresController, getStoreByIdController, updateStoreController } from '../controllers/stores/storeController';

const router = Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/images/logostore/'); // Folder where files are stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix); // Save only the filename
  }
});
const upload = multer({ storage: storage });

// Define routes with type assertions for TypeScript
router.post('/insert', authenticateToken, upload.single('logo'), createStoreController as any);
router.get('/user', authenticateToken, getStoresController as any);
router.get('/store/:storeId', authenticateToken, getStoreByIdController as any);
router.put('/update/:storeId', authenticateToken, updateStoreController as any);

export default router;
