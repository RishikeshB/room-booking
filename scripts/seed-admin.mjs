import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;
const adminUsername = process.env.DEFAULT_ADMIN_USERNAME ?? 'admin';
const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? 'Admin@123';
const userUsername = process.env.DEFAULT_USER_USERNAME ?? 'user';
const userPassword = process.env.DEFAULT_USER_PASSWORD ?? 'User@123';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not configured');
}

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

await mongoose.connect(MONGODB_URI);

// Seed admin user
let admin = await User.findOne({ username: adminUsername });
if (admin) {
  console.log(`Admin '${adminUsername}' already exists.`);
} else {
  const hashed = await bcrypt.hash(adminPassword, 10);
  admin = await User.create({ username: adminUsername, password: hashed, role: 'admin' });
  console.log(`Admin '${adminUsername}' created.`);
}

// Seed regular user
let user = await User.findOne({ username: userUsername });
if (user) {
  console.log(`User '${userUsername}' already exists.`);
} else {
  const hashed = await bcrypt.hash(userPassword, 10);
  user = await User.create({ username: userUsername, password: hashed, role: 'user' });
  console.log(`User '${userUsername}' created.`);
}

console.log('\nSeeded users:');
console.log(`  Admin: ${adminUsername} / ${adminPassword}`);
console.log(`  User:  ${userUsername} / ${userPassword}`);

await mongoose.disconnect();
