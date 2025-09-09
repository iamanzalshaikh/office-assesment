// dashboardRoute.js
import express from "express";
import { getDashboardStats } from "../controller/dashboardController.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/stats", getDashboardStats);

export default dashboardRouter;
