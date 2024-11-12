// // src/app.ts
// import express from "express";
// import mainRoutes from "./routes/mainRoutes";
// import userRoutes from "./routes/userRoutes";
// import loginRoutes from "./routes/loginRoutes";

// const app = express();

// // เพิ่มมิดเดิลแวร์เพื่อจัดการ JSON ใน req.body
// app.use(express.json());

// // ใช้งาน mainRoutes สำหรับเส้นทาง "/"
// app.use("/", mainRoutes);

// // ใช้งาน userRoutes สำหรับเส้นทาง "/users"
// app.use("/users", userRoutes);

// // ใช้งาน loginRoutes สำหรับเส้นทาง "/login"
// app.use("/login", loginRoutes);

// export default app;
