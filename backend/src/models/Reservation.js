const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: [true, 'Table is required']
    },
    reservationDate: {
      type: Date,
      required: [true, 'Reservation date is required']
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      trim: true,
      enum: ['12:00', '13:00', '14:00', '18:00', '19:00', '20:00', '21:00']
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: [1, 'Guest count must be at least 1'],
      max: [12, 'Guest count cannot exceed 12']
    },
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

reservationSchema.index({ reservationDate: 1, timeSlot: 1, tableId: 1 });
reservationSchema.index({ userId: 1, reservationDate: 1 });
reservationSchema.index({ status: 1, reservationDate: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
