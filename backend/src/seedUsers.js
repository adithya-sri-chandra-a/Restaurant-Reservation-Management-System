const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const env = require('./config/env');

const seedUsers = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Administrator';

  const customerEmail = process.env.DEMO_CUSTOMER_EMAIL || 'demo@example.com';
  const customerPassword = process.env.DEMO_CUSTOMER_PASSWORD || 'demo123';
  const customerName = process.env.DEMO_CUSTOMER_NAME || 'Demo Customer';

  try {
    const adminUser = await User.findOne({ email: adminEmail });
    if (adminUser) {
      adminUser.role = 'admin';
      adminUser.password = adminPassword;
      await adminUser.save();
      console.log(`Updated admin user ${adminEmail}`);
    } else {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log(`Created admin user ${adminEmail}`);
    }

    const customerUser = await User.findOne({ email: customerEmail });
    if (customerUser) {
      customerUser.role = 'customer';
      customerUser.password = customerPassword;
      await customerUser.save();
      console.log(`Updated demo customer user ${customerEmail}`);
    } else {
      await User.create({
        name: customerName,
        email: customerEmail,
        password: customerPassword,
        role: 'customer'
      });
      console.log(`Created demo customer user ${customerEmail}`);
    }

    console.log('User seeding finished.');
  } catch (err) {
    console.error('Seeding users failed:', err);
    process.exit(1);
  } finally {
    mongoose.disconnect();
  }
};

seedUsers();
