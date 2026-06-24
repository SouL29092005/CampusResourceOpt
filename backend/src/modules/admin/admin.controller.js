import User from "../users/user.model.js";
import Book from "../library/book.model.js";
import Equipment from "../laboratory/equipment.model.js";
import Booking from "../laboratory/booking.model.js";
import RoomBooking from "../room/roomBooking.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Total users count
    const totalUsers = await User.countDocuments({});

    // Total books count
    const totalBooks = await Book.countDocuments({});

    // Total equipments count
    const totalEquipments = await Equipment.countDocuments({});

    // Active room bookings
    const activeRoomBookings = await RoomBooking.countDocuments({
      status: "active"
    });

    // Active equipment bookings
    const activeEquipmentBookings = await Booking.countDocuments({
      status: "active"
    });

    // Total active bookings (sum of both)
    const totalActiveBookings = activeRoomBookings + activeEquipmentBookings;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBooks,
        totalEquipments,
        totalActiveBookings,
        breakdown: {
          activeRoomBookings,
          activeEquipmentBookings
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
