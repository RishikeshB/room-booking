import { InferSchemaType, Schema, model, models } from "mongoose";

const roomSchema = new Schema(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    roomType: {
      type: String,
      enum: ["AC", "Non-AC"],
      required: true
    },
    bedSize: {
      type: String,
      enum: ["King", "Queen", "Twin"],
      required: true
    },
    status: {
      type: String,
      enum: ["available", "occupied"],
      default: "available"
    }
  },
  {
    timestamps: true
  }
);

roomSchema.index({ hotelId: 1, name: 1 });
roomSchema.index({ name: 1 });
roomSchema.index({ createdAt: -1 });

export type RoomDocument = InferSchemaType<typeof roomSchema> & {
  _id: string;
};

export const Room = models.Room || model<RoomDocument>("Room", roomSchema);

