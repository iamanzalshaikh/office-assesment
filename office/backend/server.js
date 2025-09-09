import dotenv from "dotenv";
dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);

import express from 'express';
import connectDB from './config/db.js';
import cookieParser from "cookie-parser";
import authRouter from './routes/authRoute.js';

import cors from "cors";
import path from 'path';
import userRouter from "./routes/userRoute.js";
import departmentRouter from "./routes/departmentRoute.js";
import employeeRouter from "./routes/employeeRoute.js";
import dashboardRouter from "./routes/dashboardRoute.js";
 
connectDB(); // connect to MongoDB

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS configuration
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,              
}));

// Middleware
app.use(express.json());
app.use(cookieParser()); 

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/department", departmentRouter);
app.use("/api/employee" , employeeRouter)
app.use("/api/dashboard", dashboardRouter);




// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
