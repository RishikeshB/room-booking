import { z } from "zod";

import { BED_SIZES, ROOM_TYPES } from "@/lib/constants";

export const loginSchema = z.object({
  username: z.string().min(3).max(50).trim(),
  password: z.string().min(6).max(100)
});

export const hotelSchema = z.object({
  name: z.string().min(2).max(120).trim(),
  location: z.string().min(2).max(160).trim(),
  description: z.string().max(500).trim().optional().or(z.literal(""))
});

export const roomSchema = z.object({
  hotelId: z.string().min(1),
  name: z.string().min(1).max(80).trim(),
  roomType: z.enum(ROOM_TYPES),
  occupancy: z.number().min(1).max(10)
});

export const userSchema = z.object({
  username: z.string().min(3).max(50).trim(),
  password: z.string().min(6).max(100),
  role: z.enum(["admin", "user"]).default("user")
});

export const bookingSchema = z.object({
  hotelId: z.string().min(1),
  roomId: z.string().min(1),
  userName: z.string().min(2).max(100).trim(),
  contactNumber: z.string().min(8).max(20).regex(/^[0-9+\-() ]+$/, "Invalid phone number"),
  photoUrl: z.string().url().optional().or(z.literal("")),
  photoBlobName: z.string().optional()
});

export function parseWithSchema<T>(schema: z.ZodSchema<T>, payload: unknown) {
  const result = schema.safeParse(payload);

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.flatten()
    };
  }

  return {
    success: true as const,
    data: result.data
  };
}

