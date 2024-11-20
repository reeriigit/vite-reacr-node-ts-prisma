// src/controllers/productController.ts
import { Request, Response } from 'express';
import { addProduct, deleteProduct } from '../../services/productService';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { getAllProducts } from '../../services/productService';
import { updateProduct ,getProductById} from '../../services/productService';
export const createProductController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, product_type_id, description, price, cost_price, status_id } = req.body;
  const productImages = req.files ? (req.files as Express.Multer.File[]).map(file => file.filename) : [];
  const storeId = req.user?.storeIds ? req.user.storeIds[0] : undefined;
  const user_ids = req.user?.userId;
  console.log('storeis',storeId)
  console.log('user_ids',user_ids) 
  console.log('productImages',productImages)

  if (!storeId) {
    res.status(400).json({ success: false, message: 'Store ID is required' });
    return;
  }

  try {
    const newProduct = await addProduct({
      name,
      product_type_id: parseInt(product_type_id),
      description,
      price: parseFloat(price),
      cost_price: parseFloat(cost_price),
      status_id: parseInt(status_id),
      storeId,
      images: productImages,
    });


    res.status(201).json({ success: true, data: newProduct, message: 'Product added successfully!' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: 'Error adding product' });
  }
};


// src/controllers/productController.ts
export const getAllProductsController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const storeId = req.user?.storeIds ? req.user.storeIds[0] : undefined;
  
    if (!storeId) {
      res.status(400).json({ success: false, message: 'Store ID is required' });
      return;
    }
  
    try {
      const products = await getAllProducts(storeId);
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ success: false, message: 'Error fetching products' });
    }
  };
  
//delete
export const deleteProductControllter  = async (req:AuthenticatedRequest,res:Response):Promise<void>=>{
  console.log("test product api sleeter")
  const product_Id = parseInt(req.params.product_id,10);
  if(isNaN(product_Id)){
    res.status(400).json({succes:false,message: 'Invalid product ID'});
    return;
  }

  try{
    await deleteProduct(product_Id);
    res.status(200).json({ success:true,message: 'Product delete successfully'});

  }catch(error){
    console.error('Error delete product',error);
    res.status(500).json({ succsess: true,message: 'Error delereing product'});

  }
};

export const updateProductController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const productId = parseInt(req.params.product_id, 10);
  const { name, product_type_id, description, price, cost_price, status_id } = req.body;
  const productImages = req.files ? (req.files as Express.Multer.File[]).map(file => file.filename) : [];
  const storeId = req.user?.storeIds ? req.user.storeIds[0] : undefined;

  if (!storeId) {
    res.status(400).json({ success: false, message: 'Store ID is required' });
    return;
  }

  try {
    const updatedProduct = await updateProduct({
      product_id: productId,
      name,
      product_type_id: parseInt(product_type_id, 10),
      description,
      price: parseFloat(price),
      cost_price: parseFloat(cost_price),
      status_id: parseInt(status_id, 10),
      storeId,
      images: productImages.length > 0 ? productImages : undefined, // Only set images if provided
    });
    res.status(200).json({ success: true, data: updatedProduct, message: 'Product updated successfully!' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Error updating product' });
  }
};


export const getProductByIdController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const productId = parseInt(req.params.product_id, 10); // Parse product ID from the request params

  try {
    const product = await getProductById(productId);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Error fetching product' });
  }
};