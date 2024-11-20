import { prisma } from '../dbconnect/db';
import { User } from '../model/UserModel';

// Service to get user data by user_id
export const getUserDataService = async (userId: number) => {
  return await prisma.users.findUnique({
    where: { user_id: userId },
    select: {
      user_id: true,
      email: true,
      usertype_id: true,
    },
  });
};

// Service to create a new user
export const createUserService = async (userData: Omit<User, 'user_id'>) => {
  return await prisma.users.create({
    data: userData,
  });
};
