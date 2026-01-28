import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import {
  createUserByAdmin,
  deleteUserByAdmin,
  getUsersByRole
} from "./user.controller.js";

const router = express.Router();

// Admin-only routes
router.post(
  "/admin/create",
  protect,
  allowRoles("admin"),
  createUserByAdmin
);

router.get(
  "/admin/getUsers",
  protect,
  allowRoles("admin"),
  getUsersByRole
)

router.delete(
  "/admin/delete/:id",
  protect,
  allowRoles("admin"),
  deleteUserByAdmin
);

export default router;
