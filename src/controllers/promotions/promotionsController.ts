import { Request,Response } from "express";
import { prisma } from "../../dbconnect/db";
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import path from 'path';
import fs, { promises } from 'fs';

//function to get all promotions
export const getAllPromotions = async (req: Request,res:Response): Promise<void> =>{

    try{
        const promotion = await prisma.promotions.findMany({
            include:{
                PromotionType: true,
            }
        });
        res.status(200).json({ success: true,data: promotion});

    }catch(error){
        console.log("Error fetching promotions :",error);
        res.status(500).json({sucess: false, message: "Failed to fetch promotions"});

    }
};

export const getPromotionById = async (req:Request , res:Response ): Promise<void> =>{
    const {promo_id} = req.params;

    try{
        const promotion  = await prisma.promotions.findMany({
            where: {promo_id:parseInt(promo_id)},
            include: {
                PromotionType:true,
            }
        });
        if(!promotion){
            res.status(404).json({ success: false,message: "Promortions not found"});
            return
        }
        res.status(200).json({success: true,data: promotion});

    }catch(error){
        console.log("Error fetching promotion: ",error);
        res.status(500).json({success : false,message: "fail to fetching promotion"});
    }

}

export const createPromotionController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      promo_name,
      promo_type,
      promo_dec,
      amountuse,
      amountgiven,
      valuegiven_id,
      amountcon,
      valuecon_id,
      startdate,
      enddate,
      thtime,
    } = req.body;

    const storeId = req.user?.storeIds ? req.user.storeIds[0] : undefined;

    if (!storeId) {
      res.status(400).json({ success: false, message: "Store ID is required." });
      return;
    }

    // ตรวจสอบฟิลด์ที่จำเป็น
    if (!promo_name || !promo_type || !startdate || !enddate) {
      res.status(400).json({ success: false, message: "Missing required fields." });
      return;
    }

    // จัดการการอัปโหลดไฟล์
    const proimage = req.file
      ? `${req.file.filename}` // บันทึก path ของรูป
      : null;

    console.log(`Image path: ${proimage || "No image uploaded"}`);
    console.log("Promotion data received:", { promo_name, promo_type });

    // บันทึกข้อมูลเข้าสู่ฐานข้อมูล
    const newPromotion = await prisma.promotions.create({
      data: {
        storeId,
        proimage,
        promo_name,
        promo_type: Number(promo_type),
        promo_dec,
        amountuse: Number(amountuse) || 1,
        amountgiven: Number(amountgiven) || 1,
        valuegiven_id: Number(valuegiven_id) || 1,
        amountcon: Number(amountcon) || 1,
        valuecon_id: Number(valuecon_id) || 1,
        startdate,
        enddate,
        thtime: Number(thtime) || 1,
      },
    });

    res.status(201).json({
      success: true,
      data: newPromotion,
      message: "Promotion successfully created!",
    });
  } catch (error) {
    console.error("Error creating promotion:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create promotion.",
      error: (error as Error).message,
    });
  }
};


export const updatePromotionController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { promo_id } = req.params;
  const {
    promo_name,
    promo_type,
    promo_dec,
    amountuse,
    amountgiven,
    valuegiven_id,
    amountcon,
    valuecon_id,
    startdate,
    enddate,
    thtime,
  } = req.body;
  const newImageFile = req.file;

  try {
    const existingPromotion = await prisma.promotions.findUnique({
      where: { promo_id: Number(promo_id) },
    });

    if (!existingPromotion) {
      res.status(404).json({ success: false, message: 'Promotion not found' });
      return;
    }

    // Remove old image if a new one is uploaded
    if (newImageFile && existingPromotion.proimage) {
      const oldImagePath = path.join(
        __dirname,
        '../../uploads/images/promotions',
        existingPromotion.proimage
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error('Error deleting old image:', err);
      });
    }

    const updatedPromotion = await prisma.promotions.update({
      where: { promo_id: Number(promo_id) },
      data: {
        promo_name: promo_name || existingPromotion.promo_name,
        promo_type: promo_type ? Number(promo_type) : existingPromotion.promo_type,
        promo_dec: promo_dec || existingPromotion.promo_dec,
        amountuse: amountuse ? Number(amountuse) : existingPromotion.amountuse,
        amountgiven: amountgiven ? Number(amountgiven) : existingPromotion.amountgiven,
        valuegiven_id: valuegiven_id
          ? Number(valuegiven_id)
          : existingPromotion.valuegiven_id,
        amountcon: amountcon ? Number(amountcon) : existingPromotion.amountcon,
        valuecon_id: valuecon_id
          ? Number(valuecon_id)
          : existingPromotion.valuecon_id,
        startdate: startdate || existingPromotion.startdate,
        enddate: enddate || existingPromotion.enddate,
        thtime: thtime ? Number(thtime) : existingPromotion.thtime,
        proimage: newImageFile
          ? newImageFile.filename
          : existingPromotion.proimage,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedPromotion,
      message: 'Promotion updated successfully',
    });
  } catch (error) {
    console.error('Error updating promotion:', error);
    res.status(500).json({ success: false, message: 'Database update error' });
  }
};

export const getPromotionsByStoreId = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    // ดึง storeId จาก user ที่ authenticated
    const storeId = req.user?.storeIds ? req.user.storeIds[0] : null; // ใช้ storeId จาก storeIds[0]
    // console.log(storeId,"xxxxxx")
    // console.log(storeId,"")

    if (!storeId) {
      res.status(400).json({
        success: false,
        message: "Store ID is required.",
      });
      return;
    }

    // Query ข้อมูลจากฐานข้อมูล โดยใช้ storeId เป็นเงื่อนไข
    const promotions = await prisma.promotions.findMany({
      where: {
        storeId: Number(storeId), // เงื่อนไขการค้นหา
      },
      include: {
        PromotionType: true, // รวมข้อมูลประเภทโปรโมชั่น (relation)
      },
    });

    res.status(200).json({
      success: true,
      data: promotions,
    });
  } catch (error) {
    console.error("Error fetching promotions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch promotions.",
      error: (error as Error).message,
    });
  }
};
export const deletePromotionsController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { promo_id } = req.params;

  console.log("delete promotions");

  try {
    // ค้นหา Promotion ที่จะลบ
    const promotion = await prisma.promotions.findUnique({
      where: {
        promo_id: Number(promo_id), // ค้นหาจาก promo_id
      },
    });

    if (!promotion) {
      res.status(404).json({
        success: false,
        message: "Promotion not found.",
      });
      return;
    }

    // หากมีไฟล์ภาพ ให้ลบออกจากเซิร์ฟเวอร์
    if (promotion.proimage) {
      const imagePath = path.join(
        __dirname,
        "../../uploads/images/promotions",
        promotion.proimage
      );

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image file:", err);
        }
      });
    }

    // ลบข้อมูล Promotion ออกจากฐานข้อมูล
    await prisma.promotions.delete({
      where: { promo_id: Number(promo_id) },
    });

    res.status(200).json({
      success: true,
      message: "Promotion deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete promotion.",
      error: (error as Error).message,
    });
  }
};


