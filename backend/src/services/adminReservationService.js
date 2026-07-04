const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const AppError = require('../utils/AppError');

const getAllReservations = async (date) => {
  const filter = {};

  if (date) {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new AppError('Invalid date format', 400);
    }

    const start = new Date(parsedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(parsedDate);
    end.setHours(23, 59, 59, 999);

    filter.reservationDate = { $gte: start, $lte: end };
  }

  return Reservation.find(filter)
    .sort({ status: 1, reservationDate: 1, timeSlot: 1 })
    .populate(['userId', 'tableId']);
};

const updateReservation = async ({ reservationId, updateData }) => {
  if (!reservationId) {
    throw new AppError('Reservation ID is required', 400);
  }

  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    throw new AppError('Reservation not found', 404);
  }

  const allowedUpdates = ['reservationDate', 'timeSlot', 'guestCount', 'status'];
  const invalidFields = Object.keys(updateData).filter((field) => !allowedUpdates.includes(field));

  if (invalidFields.length) {
    throw new AppError(`Invalid fields: ${invalidFields.join(', ')}`, 400);
  }

  if (updateData.reservationDate) {
    reservation.reservationDate = new Date(updateData.reservationDate);
  }

  if (updateData.timeSlot) reservation.timeSlot = updateData.timeSlot;
  if (updateData.guestCount !== undefined) reservation.guestCount = updateData.guestCount;
  if (updateData.status) reservation.status = updateData.status;

  await reservation.save();
  return reservation.populate(['userId', 'tableId']);
};

const cancelReservation = async (reservationId) => {
  if (!reservationId) {
    throw new AppError('Reservation ID is required', 400);
  }

  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    throw new AppError('Reservation not found', 404);
  }

  if (reservation.status === 'cancelled') {
    throw new AppError('Reservation is already cancelled', 400);
  }

  reservation.status = 'cancelled';
  await reservation.save();
  return reservation.populate(['userId', 'tableId']);
};

const getAllTables = async () => {
  return Table.find().sort({ capacity: 1, tableNumber: 1 });
};

const createTable = async ({ tableNumber, capacity, status }) => {
  if (!tableNumber || !capacity) {
    throw new AppError('Table number and capacity are required', 400);
  }

  const existingTable = await Table.findOne({ tableNumber });
  if (existingTable) {
    throw new AppError('Table already exists', 409);
  }

  const table = await Table.create({
    tableNumber,
    capacity,
    status: status || 'available'
  });

  return table;
};

const deleteTable = async (tableId) => {
  if (!tableId) {
    throw new AppError('Table ID is required', 400);
  }

  const table = await Table.findById(tableId);
  if (!table) {
    throw new AppError('Table not found', 404);
  }

  await table.deleteOne();
  return { message: 'Table deleted successfully' };
};

module.exports = {
  getAllReservations,
  updateReservation,
  cancelReservation,
  getAllTables,
  createTable,
  deleteTable
};
