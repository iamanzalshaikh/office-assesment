import express from "express";
import { createDepartment, deleteDepartment, getDepartments, updateDepartment } from "../controller/departmentController.js";


const  departmentRouter = express.Router();

// Routes
departmentRouter.post("/create", createDepartment);          // Create department
departmentRouter.get("/get", getDepartments);             // Get all departments
departmentRouter.put("/update/:id", updateDepartment);        // Update department
departmentRouter.delete("/delete/:id", deleteDepartment);     // Delete department

export default departmentRouter;
