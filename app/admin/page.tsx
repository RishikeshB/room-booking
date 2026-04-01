import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/admin/dashboard-client";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "@/lib/auth";
import { ensureDefaultAdmin, getDashboardData } from "@/lib/repositories";
import { Hotel } from "@/models/Hotel";
import { Room } from "@/models/Room";
import { User } from "@/models/User";

export default async function AdminPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  await ensureDefaultAdmin();
  const hotels = await getDashboardData();

  await connectToDatabase();
  const users = await User.find().sort({ createdAt: -1 }).select("username role").lean();

  // If only one hotel exists and no rooms, redirect to hotel detail page to add rooms (admin only)
  if (session.role === "admin" && hotels.length === 1) {
    const hotelDoc = await Hotel.findOne().lean();
    if (hotelDoc && "_id" in hotelDoc) {
      const roomCount = await Room.countDocuments({ hotelId: hotelDoc._id });
      if (roomCount === 0) {
        redirect(`/admin/hotels/${hotelDoc._id}`);
      }
    }
  }

  return <DashboardClient hotels={JSON.parse(JSON.stringify(hotels))} users={JSON.parse(JSON.stringify(users))} role={session.role} />;
}

