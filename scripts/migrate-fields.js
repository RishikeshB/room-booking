const mongoose = require("mongoose");
require("dotenv").config();

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to database");

  // Add occupancy field to existing rooms (default to 1)
  const roomsResult = await mongoose.connection.collection("rooms").updateMany(
    { occupancy: { $exists: false } },
    { $set: { occupancy: 1 } }
  );
  console.log(`Updated ${roomsResult.modifiedCount} rooms with default occupancy`);

  // Add userName field to existing bookings (default to "Unknown")
  const bookingsResult = await mongoose.connection.collection("bookings").updateMany(
    { userName: { $exists: false } },
    { $set: { userName: "Unknown" } }
  );
  console.log(`Updated ${bookingsResult.modifiedCount} bookings with default userName`);

  await mongoose.disconnect();
  console.log("Migration completed successfully!");
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
