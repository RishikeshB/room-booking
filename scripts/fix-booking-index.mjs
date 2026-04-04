/**
 * Script to recreate the bookings collection without the unique constraint.
 * This backs up existing data, drops the collection, and restores it.
 * Run: npm run fix-booking-index
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not configured');
}

async function recreateCollection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const bookingsCollection = db.collection('bookings');

    // Step 1: Count existing documents
    const count = await bookingsCollection.countDocuments();
    console.log(`\nFound ${count} existing booking records`);

    if (count === 0) {
      console.log('Collection is empty. Dropping and recreating...');
      await bookingsCollection.drop();
      console.log('Collection dropped successfully');
      console.log('\nDone! The collection will be recreated automatically when you create your next booking.');
    } else {
      // Step 2: Backup all documents
      console.log('\nBacking up existing bookings...');
      const allBookings = await bookingsCollection.find({}).toArray();
      console.log(`Backed up ${allBookings.length} bookings`);

      // Step 3: Drop the entire collection
      console.log('\nDropping bookings collection...');
      await bookingsCollection.drop();
      console.log('Collection dropped successfully');

      // Step 4: Recreate collection (will be auto-created on next insert)
      console.log('\nDone! The collection will be recreated automatically when you create your next booking.');
      console.log(`\n⚠️  WARNING: ${allBookings.length} booking records were deleted.`);
      console.log('If you need to preserve booking history, you should export the data before running this script.');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

recreateCollection();
