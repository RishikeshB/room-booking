import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Hotel } from "@/models/Hotel";
import { Room } from "@/models/Room";
import { User } from "@/models/User";

export async function getDashboardData() {
  await connectToDatabase();

  const hotels = await Hotel.find().sort({ createdAt: -1 }).lean();
  const rooms = await Room.find().lean();
  const bookings = await Booking.find({ status: "active" }).lean();

  const bookingByRoom = new Map(bookings.map((booking) => [String(booking.roomId), booking]));

  return hotels.map((hotel) => {
    const hotelRooms = rooms.filter((room) => String(room.hotelId) === String(hotel._id));
    const allocatedRooms = hotelRooms.filter((room) => bookingByRoom.has(String(room._id)));

    return {
      ...hotel,
      totalRooms: hotelRooms.length,
      allocatedRooms: allocatedRooms.length,
      availableRooms: hotelRooms.length - allocatedRooms.length
    };
  });
}

export async function getHotelRoomDetails(hotelId: string) {
  await connectToDatabase();

  const [hotel, rooms, bookings] = await Promise.all([
    Hotel.findById(hotelId).lean(),
    Room.find({ hotelId }).sort({ name: 1 }).lean(),
    Booking.find({ hotelId, status: "active" }).lean()
  ]);

  if (!hotel) {
    return null;
  }

  const bookingsByRoom = new Map(bookings.map((booking) => [String(booking.roomId), booking]));

  return {
    hotel,
    rooms: rooms.map((room) => ({
      ...room,
      booking: bookingsByRoom.get(String(room._id)) ?? null
    }))
  };
}

export async function getBookingOptions() {
  await connectToDatabase();

  const hotels = await Hotel.find().sort({ name: 1 }).lean();
  const rooms = await Room.find({ status: "available" }).sort({ name: 1 }).lean();

  return hotels.map((hotel) => ({
    ...hotel,
    rooms: rooms.filter((room) => String(room.hotelId) === String(hotel._id))
  }));
}

export async function createBooking({
  hotelId,
  roomId,
  userId,
  contactNumber,
  photoUrl,
  photoBlobName
}: {
  hotelId: string;
  roomId: string;
  userId: string;
  contactNumber: string;
  photoUrl: string;
  photoBlobName?: string;
}) {
  await connectToDatabase();

  const room = await Room.findOne({
    _id: new Types.ObjectId(roomId),
    hotelId: new Types.ObjectId(hotelId),
    status: "available"
  });

  if (!room) {
    throw new Error("Room is no longer available");
  }

  const booking = await Booking.create({
    hotelId,
    roomId,
    userId,
    contactNumber,
    photoUrl,
    photoBlobName
  });

  room.status = "occupied";
  await room.save();

  return booking;
}

export async function ensureDefaultAdmin() {
  await connectToDatabase();

  const username = process.env.DEFAULT_ADMIN_USERNAME ?? "admin";
  const password = process.env.DEFAULT_ADMIN_PASSWORD ?? "Admin@123";

  const existingAdmin = await User.findOne({ username });
  if (existingAdmin) {
    return existingAdmin;
  }

  return User.create({
    username,
    password,
    role: "admin"
  });
}

