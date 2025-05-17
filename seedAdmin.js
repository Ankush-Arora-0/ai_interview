// seedAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'admindiya@gmail.com';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`⚠️ Admin with email ${email} already exists. Skipping creation.`);
      // If you want to update the password anyway, you could do:
      // const newHash = await bcrypt.hash('yourNewPassword', 10);
      // existing.password = newHash;
      // await existing.save();
      // console.log('🔄 Admin password updated.');
      process.exit(0);
    }

    const hash = await bcrypt.hash('123', 10);
    await User.create({
      name: 'diya sharma',
      email,
      password: hash,
      role: 'admin'
    });

    console.log('✅ Admin user created');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
