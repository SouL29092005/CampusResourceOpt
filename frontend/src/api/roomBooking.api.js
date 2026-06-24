import api from "./axios";

export const getAllRooms = () => api.get("/room/getRooms");

export const createRoomBooking = (data) => api.post("/roomBooking/room-booking", data);

export const cancelRoomBooking = (bookingId) => api.patch(`/roomBooking/room-booking/${bookingId}/cancel`);

export const getMyRoomBookings = () => api.get("/roomBooking/room-bookings?bookedBy=me");
