const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const AppError = require('../utils/AppError');

const normalizeDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError('Invalid reservation date', 400);
  }
  return date;
};

const isPastReservation = (reservationDate, timeSlot) => {
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const selectedDateTime = new Date(reservationDate);
  selectedDateTime.setHours(hours, minutes, 0, 0);

  const now = new Date();
  return selectedDateTime <= now;
};

const createReservation = async ({ userId, reservationDate, timeSlot, guestCount }) => {
  if (!userId || !reservationDate || !timeSlot || guestCount === undefined) {
    throw new AppError('Please provide userId, reservationDate, timeSlot, and guestCount', 400);
  }

  if (guestCount < 1) {
    throw new AppError('Guest count must be at least 1', 400);
  }

  const normalizedDate = normalizeDate(reservationDate);

  if (isPastReservation(normalizedDate, timeSlot)) {
    throw new AppError('You cannot book for a past date or time', 400);
  }

  const existingReservation = await Reservation.findOne({
    userId,
    reservationDate: normalizedDate,
    timeSlot,
    status: 'active'
  });

  if (existingReservation) {
    throw new AppError('You already have an active reservation for this date and time slot', 409);
  }

  const tables = await Table.find({ status: 'available' }).sort({ capacity: 1, tableNumber: 1 });

  const reservedTableIds = await Reservation.find({
    reservationDate: normalizedDate,
    timeSlot,
    status: 'active'
  }).distinct('tableId');

  const eligibleTable = tables.find((table) => {
    return table.capacity >= guestCount && !reservedTableIds.some((id) => id.toString() === table._id.toString());
  });

  if (!eligibleTable) {
    throw new AppError('No available table matches your guest count for the selected time', 409);
  }

  const reservation = await Reservation.create({
    userId,
    tableId: eligibleTable._id,
    reservationDate: normalizedDate,
    timeSlot,
    guestCount,
    status: 'active'
  });

  return reservation.populate(['userId', 'tableId']);
};

module.exports = { createReservation };
