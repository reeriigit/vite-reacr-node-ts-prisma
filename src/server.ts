// src/server.ts
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import mainRoutes from './routes/mainRoutes';
import userRoutes from './routes/userRoutes';
import loginRoutes from './routes/loginRoutes'; // import route file
import createTokenRoute from './routes/createTokenRoute';
import verifyTokenRoute from './routes/verifyTokenRoute';
import storesRoutes from './routes/storeRoutes'; // Import store routes
import { prisma } from './dbconnect/db';
import productTypeRoutes from './routes/productTypeRoutes';
import productRoutes from './routes/productRoutes';
import promotionTypeRoutes from './routes/promotionTypeRoutes'
import promotionsRoutes from './routes/promotionsRoutes'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// Routes
app.use("/", mainRoutes);
app.use("/users", userRoutes);
app.use("/", loginRoutes); // กำหนดเส้นทาง login
app.use("/user", createTokenRoute);
app.use("/user", verifyTokenRoute);
app.use("/stores", storesRoutes); // Define `/stores` route directly for storesRoutes
app.use('/product-types', productTypeRoutes); // Add this line to include product type routes

app.use('/src/uploads/images', express.static('src/uploads/images'));// ให้สามารถเข้าถึงภาพได้

app.use('/products', productRoutes); // Add product routes here
app.use('/promotion-types', promotionTypeRoutes); // Add product routes here
app.use('/promotions', promotionsRoutes); // Add product routes here

// Connect to the database
prisma.$connect()
  .then(() => console.log("Connected to PostgreSQL via Prisma"))
  .catch((err) => console.error("Connection error", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
