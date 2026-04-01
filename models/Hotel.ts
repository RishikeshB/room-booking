import { InferSchemaType, Schema, model, models } from "mongoose";

const hotelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

hotelSchema.index({ name: 1 });
hotelSchema.index({ createdAt: -1 });

export type HotelDocument = InferSchemaType<typeof hotelSchema> & {
  _id: string;
};

export const Hotel = models.Hotel || model<HotelDocument>("Hotel", hotelSchema);

