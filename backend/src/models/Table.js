const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: [true, 'Table number is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
      max: [12, 'Capacity cannot exceed 12']
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'maintenance'],
      default: 'available'
    }
  },
  {
    timestamps: true
  }
);

tableSchema.index({ status: 1, capacity: 1 });

module.exports = mongoose.model('Table', tableSchema);
