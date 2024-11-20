// src/controllers/productTypeController.ts
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { prisma } from '../../dbconnect/db';
import fs from 'fs';
import path from 'path';

export const createProductTypeController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const storeId = req.user?.storeIds ? req.user.storeIds[0] : null; // ใช้ storeId จาก storeIds[0]
  const { producttype_name, description, submncondt } = req.body;

  if (!userId || storeId === null) {
    res.status(403).json({ success: false, message: 'User ID or Store ID not found in token' });
    return;
  }

  try {
    // Creating a new product type in the database
    const newProductType = await prisma.productType.create({
      data: {
        storeId: Number(storeId),
        producttype_name,
        producttype_image: req.file ? req.file.filename : null, // Only store filename in the database
        description,
        submncondt: submncondt ? parseInt(submncondt, 10) : undefined,
      },
    });

    res.status(201).json({ success: true, data: newProductType, message: 'Product type created successfully' });
  } catch (error) {
    console.error('Database insertion error:', error);
    res.status(500).json({ success: false, message: 'Database insertion error' });
  }
};

export const getAllProductTypesController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const storeId = req.user?.storeIds ? req.user.storeIds[0] : null; // ใช้ storeId จาก storeIds[0]
  
    if (!userId || !storeId) {
      res.status(403).json({ success: false, message: 'User ID or store ID not found in token' });
      return;
    }
  
    try {
      const productTypes = await prisma.productType.findMany({
        where: { storeId },
      });

      
      res.status(200).json({ success: true, data: productTypes });
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ success: false, message: 'Database query error' });
    }
  };

  export const deleteProductTypeController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { producttype_id } = req.params;
  
    try {
      const productType = await prisma.productType.findUnique({
        where: { producttype_id: Number(producttype_id) },
      });
  
      if (!productType) {
        res.status(404).json({ success: false, message: 'Product type not found' });
        return;
      }
  
      // Delete the image file if it exists
      if (productType.producttype_image) {
        const imagePath = path.join(__dirname, '../../uploads/images/producttypes', productType.producttype_image);
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Failed to delete image file:', err);
        });
      }
  
      // Delete the product type from the database
      await prisma.productType.delete({
        where: { producttype_id: Number(producttype_id) },
      });
  
      res.status(200).json({ success: true, message: 'Product type deleted successfully' });
    } catch (error) {
      console.error('Error deleting product type:', error);
      res.status(500).json({ success: false, message: 'Failed to delete product type' });
    }
  };


export const updateProductTypeController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { producttype_id } = req.params;
    const { producttype_name, description, submncondt } = req.body;
    const newImageFile = req.file;
  
    try {
      const existingProductType = await prisma.productType.findUnique({ where: { producttype_id: Number(producttype_id) } });
  
      if (!existingProductType) {
        res.status(404).json({ success: false, message: 'Product type not found' });
        return;
      }
  
      // Remove old image if a new one is uploaded
      if (newImageFile && existingProductType.producttype_image) {
        const oldImagePath = path.join(__dirname, '../../uploads/images/producttypes', existingProductType.producttype_image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
  
      const updatedProductType = await prisma.productType.update({
        where: { producttype_id: Number(producttype_id) },
        data: {
          producttype_name: producttype_name || existingProductType.producttype_name,
          description: description || existingProductType.description,
          submncondt: submncondt ? parseInt(submncondt, 10) : existingProductType.submncondt,
          producttype_image: newImageFile ? newImageFile.filename : existingProductType.producttype_image,
        },
      });
  
      res.status(200).json({ success: true, data: updatedProductType, message: 'Product type updated successfully' });
    } catch (error) {
      console.error('Error updating product type:', error);
      res.status(500).json({ success: false, message: 'Database update error' });
    }
  };

  export const getProductTypeByIdController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { producttype_id } = req.params;
  
    try {
      const productType = await prisma.productType.findUnique({
        where: { producttype_id: Number(producttype_id) },
      });
  
      if (!productType) {
        res.status(404).json({ success: false, message: 'Product type not found' });
        return;
      }
  
      res.status(200).json({ success: true, data: productType });
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ success: false, message: 'Database query error' });
    }
  };
