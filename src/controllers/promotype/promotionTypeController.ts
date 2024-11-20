import { Request, Response } from 'express';
import { prisma } from '../../dbconnect/db'; // Replace with the path to your Prisma client

// Controller to fetch all promotion types
export const getAllPromotionTypesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const promotionTypes = await prisma.promotionType.findMany({
      include: {
        Promotions: true, // Include related promotions if needed
      },
    });

    res.status(200).json({ success: true, data: promotionTypes });
  } catch (error) {
    console.error('Error fetching promotion types:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch promotion types' });
  }
};
