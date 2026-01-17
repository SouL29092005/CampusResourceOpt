import express from "express";
import { addEquipment, updateEquipment, bookEquipment, cancelEquipmentBooking,  } from "./lab.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js"
import { getFreeSlots } from "./lab.service.js";

const router = express.Router();

router.post(
  "/addEquipment",
  protect,
  allowRoles("admin", "lab_admin"),
  addEquipment
);

router.patch(
  "/updateEquipment/:equipmentNumber",
  protect,
  allowRoles("admin", "lab_admin"),
  updateEquipment
);

router.post(
  "/equipment/book",
  protect,
  allowRoles("student"),
  bookEquipment
);

router.patch(
  "/booking/:bookingId/cancel",
  protect,
  allowRoles("student"),
  cancelEquipmentBooking
);

router.get(
  "/equipment/:equipmentNumber/free-slots",
  protect,
  allowRoles("student"),
  getFreeSlots
);

export default router;
