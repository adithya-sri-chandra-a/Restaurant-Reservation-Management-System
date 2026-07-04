const asyncHandler = require('../utils/asyncHandler');
const {
  getAllReservations,
  updateReservation,
  cancelReservation,
  getAllTables,
  createTable,
  deleteTable
} = require('../services/adminReservationService');

exports.getReservations = asyncHandler(async (req, res) => {
  const reservations = await getAllReservations(req.query.date);

  res.status(200).json({
    success: true,
    count: reservations.length,
    data: reservations
  });
});

exports.updateReservation = asyncHandler(async (req, res) => {
  const reservation = await updateReservation({
    reservationId: req.params.id,
    updateData: req.body
  });

  res.status(200).json({
    success: true,
    message: 'Reservation updated successfully',
    data: reservation
  });
});

exports.cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await cancelReservation(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Reservation cancelled successfully',
    data: reservation
  });
});

exports.getTables = asyncHandler(async (req, res) => {
  const tables = await getAllTables();

  res.status(200).json({
    success: true,
    count: tables.length,
    data: tables
  });
});

exports.createTable = asyncHandler(async (req, res) => {
  const table = await createTable(req.body);

  res.status(201).json({
    success: true,
    message: 'Table created successfully',
    data: table
  });
});

exports.deleteTable = asyncHandler(async (req, res) => {
  const result = await deleteTable(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message
  });
});
