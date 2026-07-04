const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Table = require('./models/Table');
const env = require('./config/env');

const seedTables = async () => {
  await connectDB();

  const initialTables = [
    { tableNumber: '1', capacity: 2, status: 'available' },
    { tableNumber: '2', capacity: 2, status: 'available' },
    { tableNumber: '3', capacity: 4, status: 'available' },
    { tableNumber: '4', capacity: 4, status: 'available' },
    { tableNumber: '5', capacity: 6, status: 'available' },
    { tableNumber: '6', capacity: 6, status: 'available' },
    { tableNumber: '7', capacity: 8, status: 'available' },
    { tableNumber: '8', capacity: 8, status: 'available' },
    { tableNumber: '9', capacity: 10, status: 'available' },
    { tableNumber: '10', capacity: 10, status: 'available' },
    { tableNumber: '11', capacity: 12, status: 'available' },
    { tableNumber: '12', capacity: 12, status: 'available' },
  ];

  for (const tableData of initialTables) {
    const existingTable = await Table.findOne({ tableNumber: tableData.tableNumber });
    if (!existingTable) {
      await Table.create(tableData);
      console.log(`Inserted table ${tableData.tableNumber}`);
    } else {
      console.log(`Table ${tableData.tableNumber} already exists`);
    }
  }

  console.log('Table seeding complete');
  mongoose.disconnect();
};

seedTables().catch((error) => {
  console.error('Table seeding failed:', error);
  mongoose.disconnect();
  process.exit(1);
});
