import { Request, Response } from 'express';
import { createStore, getStoresByUserId, getStoreById, updateStoreById } from '../../services/storeService';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export const createStoreController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const storeId = req.user?.storeIds;
  console.log("userId ",userId)
  console.log("userId ",storeId)
  const { storeName, storeType, storeDes, style, province, phone, address, status } = req.body;

  if (!userId) {
    res.status(403).json({ success: false, message: "User ID not found in token" });
    return;
  }

  try {
    const newStore = await createStore({
      user_id: userId,
      storeName,
      storeType: parseInt(storeType),
      storeDes,
      style: parseInt(style),
      province,
      phone,
      address,
      status: parseInt(status),
      logo: req.file ? req.file.filename : null, // Store only the filename
    });
    res.status(201).json({ success: true, data: newStore, message: 'Store created successfully' });
  } catch (error) {
    console.error("Database insertion error:", error);
    res.status(500).json({ success: false, message: 'Database insertion error' });
  }
};

export const getStoresController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(403).json({ success: false, message: "User ID not found in token" });
    return;
  }

  try {
    const stores = await getStoresByUserId(userId);
    res.status(200).json({ success: true, data: stores, message: stores.length ? undefined : 'No stores found for this user' });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ success: false, message: 'Database query error' });
  }
};

export const getStoreByIdController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { storeId } = req.params;

  if (!userId) {
    res.status(403).json({ success: false, message: "User ID not found in token" });
    return;
  }

  try {
    const store = await getStoreById(Number(storeId));
    if (!store || store.user_id !== userId) {
      res.status(404).json({ success: false, message: 'Store not found or access denied' });
      return;
    }
    res.status(200).json({ success: true, data: store });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ success: false, message: 'Database query error' });
  }
};

export const updateStoreController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { storeId } = req.params;
  const updateData = req.body;

  if (!userId) {
    res.status(403).json({ success: false, message: "User ID not found in token" });
    return;
  }

  try {
    const store = await getStoreById(Number(storeId));
    if (!store || store.user_id !== userId) {
      res.status(404).json({ success: false, message: 'Store not found or access denied' });
      return;
    }

    const updatedStore = await updateStoreById(Number(storeId), updateData);
    res.status(200).json({ success: true, data: updatedStore, message: 'Store updated successfully' });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ success: false, message: 'Database update error' });
  }
};
