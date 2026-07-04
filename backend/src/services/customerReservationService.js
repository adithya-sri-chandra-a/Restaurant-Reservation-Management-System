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

const createCustomerReservation = async ({ userId, reservationDate, timeSlot, guestCount }) => {
  if (!userId || !reservationDate || !timeSlot || guestCount === undefined) {
    throw new AppError('Please provide reservationDate, timeSlot, and guestCount', 400);
  }

  if (guestCount < 1) {
    throw new AppError('Guest count must be at least 1', 400);
  }

  const normalizedDate = normalizeDate(reservationDate);

  const existingActiveReservation = await Reservation.findOne({
    userId,
    reservationDate: normalizedDate,
    timeSlot,
    status: 'active'
  });

  if (existingActiveReservation) {
    throw new AppError('You already have an active reservation for this date and time slot', 409);
  }

  const availableTables = await Table.find({ status: 'available' }).sort({ capacity: 1, tableNumber: 1 });

  const reservedTableIds = await Reservation.find({
    reservationDate: normalizedDate,
    timeSlot,
    status: 'active'
  }).distinct('tableId');

  const suitableTable = availableTables.find((table) => {
    const isReserved = reservedTableIds.some((id) => id.toString() === table._id.toString());
    return table.capacity >= guestCount && !isReserved;
  });

  if (!suitableTable) {
    throw new AppError('No available table matches your guest count for the selected time', 409);
  }

  const reservation = await Reservation.create({
    userId,
    tableId: suitableTable._id,
    reservationDate: normalizedDate,
    timeSlot,
    guestCount,
    status: 'active'
  });

  return reservation.populate(['userId', 'tableId']);
};

const getCustomerReservations = async (userId) => {
  return Reservation.find({ userId, status: 'active' })
    .sort({ reservationDate: 1, timeSlot: 1 })
    .populate('tableId');
};

const cancelCustomerReservation = async ({ reservationId, userId }) => {
  if (!reservationId) {
    throw new AppError('Reservation ID is required', 400);
  }

  const reservation = await Reservation.findById(reservationId);

  if (!reservation) {
    throw new AppError('Reservation not found', 404);
  }

  const reservationOwnerId = reservation.userId?.toString();
  const currentUserId = userId?.toString();

  if (reservationOwnerId !== currentUserId) {
    throw new AppError('You are not authorized to cancel this reservation', 403);
  }

  if (reservation.status === 'cancelled') {
    throw new AppError('Reservation is already cancelled', 400);
  }

  reservation.status = 'cancelled';
  await reservation.save();

  return reservation;
};

module.exports = {
  createCustomerReservation,
  getCustomerReservations,
  cancelCustomerReservation
};
