import { createEquipment, updateEquipmentService, createBooking, cancelBooking } from "./lab.service.js";
import User from "../users/user.model.js";

export const addEquipment = async (req, res) => {
  try {
    const { name, description, labName, location, maintainedByEmail } = req.body;

    let finalMaintainedBy;

    if (req.user.role === "lab_admin") {
      finalMaintainedBy = req.user._id; 
    }
    
    if (req.user.role === "admin") {
      if (!maintainedByEmail) {
        throw new Error("maintainedBy is required for admin");
      }
      const user = await User.findOne({
        email: maintainedByEmail,
        role: "lab_admin"
      });

      if (!user) {
        throw new Error("No lab admin found with this email");
      }
      finalMaintainedBy = user._id;
    }

    const equipment = await createEquipment({
      name,
      description,
      labName,
      location,
      maintainedBy: finalMaintainedBy
    });

    res.status(201).json({
      success: true,
      message: "Equipment added successfully",
      equipment
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const { equipmentNumber } = req.params;

    const equipment = await updateEquipmentService({
      equipmentNumber,
      updates: req.body,
      requesterRole: req.user.role,
      requesterUserId: req.user._id
    });

    res.status(200).json({
      success: true,
      message: "Equipment updated successfully",
      equipment
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const bookEquipment = async (req, res) => {
  try {
    const { equipmentNumber, startTime, endTime } = req.body;

    const booking = await createBooking({
      equipmentNumber,
      userId: req.user._id,
      startTime: new Date(startTime),
      endTime: new Date(endTime)
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const cancelEquipmentBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await cancelBooking(
      bookingId,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
