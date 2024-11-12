// src/models/UserModel.ts

export interface User {
    user_id?: number;
    referral_code: string;
    referred_by: string;
    username: string;
    email: string;
    password: string;
    fullname: string;
    address: string;
    phone_number: string;
    usertype_id: number;
  }
  