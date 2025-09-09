import express from "express";
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from "../controller/employeeController.js";

const  employeeRouter  = express.Router();

employeeRouter.post("/create", createEmployee);             
employeeRouter.get("/get", getEmployees);                 
employeeRouter.put("/update/:id", updateEmployee);           
employeeRouter.delete("/delete/:id", deleteEmployee);       

export default employeeRouter;
