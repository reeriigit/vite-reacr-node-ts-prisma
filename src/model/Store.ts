// src/models/Store.ts

export interface Store {
    storeId: number;          // Primary Key
    user_id: number;          // Foreign Key to the Users model
    logo?: string;            // Optional field for storing large text or image URL
    storeName: string;        // Store name
    storeType: number;        // Store type
    storeDes?: string;        // Optional field for store description
    style?: number;           // Optional field for style
    province?: string;        // Optional field for province
    phone?: string;           // Optional field for phone number
    address?: string;         // Optional field for address
    status: number;           // Status (e.g., active/inactive)
  }
  