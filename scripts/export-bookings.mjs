/**
 * Script to export bookings to JSON file
 * Run: npm run export-bookings
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not configured');
}

async function exportBookings() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const bookingsCollection = mongoose.connection.db.collection("bookings");
    const allBookings = await bookingsCollection.find({}).toArray();
    
    console.log(`\nFound ${allBookings.length} booking records`);

    if (allBookings.length === 0) {
      console.log("No bookings to export");
      return;
    }

    // Export to JSON file
    const exportDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportFile = path.join(exportDir, `bookings-export-${timestamp}.json`);
    
    fs.writeFileSync(exportFile, JSON.stringify(allBookings, null, 2));
    console.log(`\n✓ Exported ${allBookings.length} bookings to: ${exportFile}`);

    // Show summary
    const activeBookings = allBookings.filter(b => b.status === 'active').length;
    const cancelledBookings = allBookings.filter(b => b.status === 'cancelled').length;
    console.log(`\nSummary:`);
    console.log(`  Active: ${activeBookings}`);
    console.log(`  Cancelled: ${cancelledBookings}`);

  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

exportBookings();
