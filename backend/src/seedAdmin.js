const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const env = require('./config/env');

const seedAdmin = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Administrator';

  try {
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        existing.password = adminPassword;
        await existing.save();
        console.log(`Updated user ${adminEmail} to role=admin`);
      } else {
        console.log(`Admin user ${adminEmail} already exists`);
      }
    } else {
      await User.create({ name: adminName, email: adminEmail, password: adminPassword, role: 'admin' });
      console.log(`Created admin user ${adminEmail} with default password`);
    }
  } catch (err) {
    console.error('Seeding admin failed:', err);
    process.exit(1);
  } finally {
    mongoose.disconnect();
  }
};

seedAdmin();
