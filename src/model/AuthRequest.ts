// src/model/AuthRequest.ts
import { Request } from 'express';

// ขยาย Request ให้มี user property สำหรับข้อมูลโทเค็น
export interface AuthRequest extends Request {
  user?: any; // สามารถกำหนดประเภทให้ตรงกับข้อมูลในโทเค็น เช่น user_id, username
}
