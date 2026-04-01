import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not configured');
}

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  },
  { timestamps: true },
);
userSchema.index({ createdAt: -1 });

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
  },
  { timestamps: true },
);
hotelSchema.index({ name: 1 });
hotelSchema.index({ createdAt: -1 });

const roomSchema = new mongoose.Schema(
  {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    name: { type: String, required: true, trim: true },
    roomType: { type: String, enum: ['AC', 'Non-AC'], required: true },
    bedSize: { type: String, enum: ['King', 'Queen', 'Twin'], required: true },
    status: { type: String, enum: ['available', 'occupied'], default: 'available' },
  },
  { timestamps: true },
);
roomSchema.index({ hotelId: 1, name: 1 });
roomSchema.index({ name: 1 });
roomSchema.index({ createdAt: -1 });

const bookingSchema = new mongoose.Schema(
  {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    contactNumber: { type: String, required: true },
    photoUrl: { type: String, required: true },
    photoBlobName: String,
    status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
  },
  { timestamps: true },
);
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ createdAt: -1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Hotel = mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);
const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

await mongoose.connect(MONGODB_URI);

console.log('Creating indexes for Cosmos DB...\n');

try {
  await User.createIndexes();
  console.log('✓ User indexes created');
} catch (err) {
  console.error('✗ User indexes error:', err.message);
}

try {
  await Hotel.createIndexes();
  console.log('✓ Hotel indexes created');
} catch (err) {
  console.error('✗ Hotel indexes error:', err.message);
}

try {
  await Room.createIndexes();
  console.log('✓ Room indexes created');
} catch (err) {
  console.error('✗ Room indexes error:', err.message);
}

try {
  await Booking.createIndexes();
  console.log('✓ Booking indexes created');
} catch (err) {
  console.error('✗ Booking indexes error:', err.message);
}

console.log('\nIndex creation complete.');
await mongoose.disconnect();
