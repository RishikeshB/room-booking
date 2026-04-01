import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not configured");
}

// Import models to register schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" }
}, { timestamps: true });

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  description: { type: String, default: "" }
}, { timestamps: true });
hotelSchema.index({ createdAt: -1 });

const roomSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
  name: { type: String, required: true, trim: true },
  roomType: { type: String, enum: ["AC", "Non-AC"], required: true },
  bedSize: { type: String, enum: ["King", "Queen", "Twin"], required: true },
  status: { type: String, enum: ["available", "occupied"], default: "available" }
}, { timestamps: true });
roomSchema.index({ createdAt: -1 });

const bookingSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  contactNumber: { type: String, required: true },
  photoUrl: { type: String, required: true },
  photoBlobName: String,
  status: { type: String, enum: ["active", "cancelled"], default: "active" }
}, { timestamps: true });
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ createdAt: -1 });

mongoose.model("User", userSchema);
mongoose.model("Hotel", hotelSchema);
mongoose.model("Room", roomSchema);
mongoose.model("Booking", bookingSchema);

await mongoose.connect(MONGODB_URI);

console.log("Syncing indexes...\n");

const models = mongoose.models;
for (const modelName of Object.keys(models)) {
  const Model = models[modelName];
  if (Model && typeof Model.syncIndexes === "function") {
    try {
      const result = await Model.syncIndexes();
      const dropped = Object.keys(result).filter(k => result[k].dropped?.length > 0);
      const created = Object.keys(result).filter(k => result[k].created?.length > 0);
      
      console.log(`${modelName}:`);
      if (dropped.length > 0) console.log(`  - Dropped: ${dropped.join(", ")}`);
      if (created.length > 0) console.log(`  + Created: ${created.join(", ")}`);
      if (dropped.length === 0 && created.length === 0) {
        console.log(`  ✓ Indexes up to date`);
      }
    } catch (err) {
      console.error(`Error syncing ${modelName}:`, err.message);
    }
  }
}

console.log("\nIndex sync complete.");
await mongoose.disconnect();
