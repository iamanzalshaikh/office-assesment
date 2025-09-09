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
const allowedOrigins = [
  "https://office-assesment-1.onrender.com",
  "https://officemanagment.netlify.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
