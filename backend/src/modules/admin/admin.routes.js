import express from "express";
import { getDashboardStats } from "./admin.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/dashboard/stats",
  protect,
  allowRoles("admin"),
  getDashboardStats
);

export default router;
