import express from "express";

import userRoutes from "./modules/users/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import timetableRoutes from "./modules/timetable/timetable.routes.js";
import profileRoutes from "./modules/users/profile.routes.js";
import subjectRoutes from "./modules/timetable/course.routes.js";
import libraryRoutes from "./modules/library/library.routes.js";
import labRoutes from "./modules/laboratory/lab.routes.js";
import roomRoutes from "./modules/room/room.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/timetable", timetableRoutes);
router.use("/profile", profileRoutes);
router.use("/subject", subjectRoutes);
router.use("/library", libraryRoutes);
router.use("/lab", labRoutes);
router.use("/room", roomRoutes);

export default router;
