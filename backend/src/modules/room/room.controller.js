import Room from "./room.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";


export const addRoom = async (req, res, next) => {
  try {
    const {
      roomId,
      location,
      roomType,
      capacity,
      facilities,
      department
    } = req.body;

    if (!roomId || location === undefined || !roomType || !capacity) {
      return next(new ApiError(400, "Missing required room fields"));
    }

    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return next(new ApiError(409, "Room with this roomId already exists"));
    }

    const room = await Room.create({
      roomId,
      location,
      roomType,
      capacity,
      facilities,
      department
    });

    return res
      .status(201)
      .json(new ApiResponse(201, room, "Room added successfully"));
  } catch (error) {
    next(error);
  }
};

export const softDeleteRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId, isActive: true });
    if (!room) {
      return next(new ApiError(404, "Room not found or already inactive"));
    }

    room.isActive = false;
    await room.save();

    return res
      .status(200)
      .json(new ApiResponse(200, room, "Room soft-deleted successfully"));
  } catch (error) {
    next(error);
  }
};


export const getAllActiveRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ isActive: true });

    return res
      .status(200)
      .json(new ApiResponse(200, rooms, "Active rooms fetched successfully"));
  } catch (error) {
    next(error);
  }
};


export const getRoomById = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId, isActive: true });
    if (!room) {
      return next(new ApiError(404, "Room not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, room, "Room fetched successfully"));
  } catch (error) {
    next(error);
  }
};
