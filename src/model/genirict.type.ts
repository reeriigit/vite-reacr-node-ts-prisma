// src/model/genirict.type.ts
import { Request } from "express";
import { Query } from "express-serve-static-core";

// สำหรับ query parameters
export interface TypedRequestQuery<T extends Query> extends Request {
  query: T;
}

// สำหรับ body
export interface TypedRequestBody<T> extends Request {
  body: T;
}
