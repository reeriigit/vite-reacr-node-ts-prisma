// src/services/productService.ts
import { prisma } from '../dbconnect/db';
import fs from 'fs';
import path from 'path';

interface ProductData {
  product_id?: number;
  name: string;
  product_type_id: number;
  description?: string;
  price: number;
  cost_price: number;
  status_id: number;
  storeId: number; // Ensure storeId is present
  images?: string[];
}



export const addProduct = async (productData: ProductData) => {
  const newProduct = await prisma.product.create({
    data: {
      ...productData,
      images: productData.images || [], // Store array of filenames or empty array if no images
    },
  });

  return newProduct;
};

// src/services/productService.ts
export const getAllProducts = async (storeId: number) => {
  return await prisma.product.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      productType: true, // Include related product type data if necessary
      store: true,       // Include related store data if necessary
    },
  });
};

export const deleteProduct = async (productId: number) => {
  // Fetch the product to get its images
  const product = await prisma.product.findUnique({
    where: { product_id: productId },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  // Delete the images associated with the product
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((image) => {
      const imagePath = path.join(__dirname, '../uploads/images/products', image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Failed to delete image file: ${imagePath}`, err);
        } else {
          console.log(`Successfully deleted image file: ${imagePath}`);
        }
      });
    });
  }

  // Delete the product from the database
  return await prisma.product.delete({
    where: {
      product_id: productId,
    },
  });
};


export const updateProduct = async (productData: ProductData) => {
  // ดึงข้อมูลสินค้าปัจจุบันเพื่อหาภาพเก่า
  const existingProduct = await prisma.product.findUnique({
    where: { product_id: productData.product_id },
    select: { images: true },
  });

  if (!existingProduct) {
    throw new Error('Product not found');
  }

  // ลบภาพเก่าเมื่อมีการส่งภาพใหม่มา
  if (productData.images && productData.images.length > 0) {
    existingProduct.images.forEach((oldImage) => {
      const imagePath = path.resolve(__dirname, '../uploads/images/products', oldImage);
      console.log(`Attempting to delete image at path: ${imagePath}`);

      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Deleted image: ${imagePath}`);
        } else {
          console.log(`Image not found at path: ${imagePath}`);
        }
      } catch (err) {
        console.error(`Error deleting image at path: ${imagePath}`, err);
      }
    });
  }

  // อัปเดตข้อมูลสินค้าพร้อมกับอัปเดตรูปภาพเมื่อส่งข้อมูลใหม่มา
  return await prisma.product.update({
    where: { product_id: productData.product_id },
    data: {
      name: productData.name,
      product_type_id: productData.product_type_id,
      description: productData.description,
      price: productData.price,
      cost_price: productData.cost_price,
      status_id: productData.status_id,
      storeId: productData.storeId,
      ...(productData.images && { images: productData.images }), // อัปเดตรูปภาพเมื่อมีการส่งรูปใหม่มาเท่านั้น
    },
  });
};


export const getProductById = async (productId: number) => {
  return await prisma.product.findUnique({
    where: { product_id: productId },
    include: {
      productType: true, // Include related product type if needed
      store: true,       // Include related store if needed
    },
  });
};