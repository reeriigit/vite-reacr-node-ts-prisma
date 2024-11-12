// src/server.ts
import express from 'express';
import mainRoutes from './routes/mainRoutes';
import userRoutes from './routes/userRoutes';
import loginRoutes from './routes/loginRoutes';
import createTokenRoute from './routes/createTokenRoute';
import verifyTokenRoute from './routes/verifyTokenRoute';
import { prisma } from './dbconnect/db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", mainRoutes);
app.use("/users", userRoutes);
app.use("/login", loginRoutes);
app.use("/user", createTokenRoute);
app.use("/user", verifyTokenRoute);

prisma.$connect()
  .then(() => console.log("Connected to PostgreSQL via Prisma"))
  .catch((err) => console.error("Connection error", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
