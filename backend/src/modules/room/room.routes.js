import express from "express";
import {
  addRoom,
  softDeleteRoom,
  getAllActiveRooms,
  getRoomById
} from "./room.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles }  from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("admin"),
  addRoom
);

router.delete(
  "/:roomId",
  protect,
  allowRoles("admin"),
  softDeleteRoom
);


router.get(
  "/",
  protect,
  getAllActiveRooms
);

router.get(
  "/:roomId",
  protect,
  getRoomById
);

export default router;
