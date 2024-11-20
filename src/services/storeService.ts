// src/services/storeService.ts
import { prisma } from '../dbconnect/db';

export const createStore = async (data: any) => {
  return await prisma.stores.create({ data });
};

export const getStoresByUserId = async (userId: number) => {
  return await prisma.stores.findMany({
    where: { user_id: userId },
    select: { storeId: true, logo: true, storeName: true, status: true },
  });
};

export const getStoreById = async (storeId: number) => {
  return await prisma.stores.findUnique({ where: { storeId } });
};

export const updateStoreById = async (storeId: number, data: any) => {
  return await prisma.stores.update({ where: { storeId }, data });
};
