import { InferSchemaType, Schema, model, models } from "mongoose";

const bookingSchema = new Schema(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    userName: {
      type: String,
      required: true
    },
    contactNumber: {
      type: String,
      required: true
    },
    photoUrl: {
      type: String,
      required: true
    },
    photoBlobName: String,
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ createdAt: -1 });

export type BookingDocument = InferSchemaType<typeof bookingSchema> & {
  _id: string;
};

export const Booking = models.Booking || model<BookingDocument>("Booking", bookingSchema);

