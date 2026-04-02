// MongoDB migration script - Run this in MongoDB Shell or Compass
// Usage: mongosh <connection-string> scripts/migrate-fields-mongo.js

db.rooms.updateMany(
  { occupancy: { $exists: false } },
  { $set: { occupancy: 1 } }
);

db.bookings.updateMany(
  { userName: { $exists: false } },
  { $set: { userName: "Unknown" } }
);

print("Migration completed successfully!");
