import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "./course.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/:id", getCourseById);

router.post("/create", protect, allowRoles("admin"), createCourse);
router.put("/update/:id", protect, allowRoles("admin"), updateCourse);
router.delete("/delete/:id", protect, allowRoles("admin"), deleteCourse);

export default router;
