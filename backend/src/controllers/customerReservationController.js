const asyncHandler = require('../utils/asyncHandler');
const {
  createCustomerReservation,
  getCustomerReservations,
  cancelCustomerReservation
} = require('../services/customerReservationService');

exports.createReservation = asyncHandler(async (req, res) => {
  const reservation = await createCustomerReservation({
    userId: req.user._id,
    reservationDate: req.body.reservationDate,
    timeSlot: req.body.timeSlot,
    guestCount: req.body.guestCount
  });

  res.status(201).json({
    success: true,
    message: 'Reservation created successfully',
    data: reservation
  });
});

exports.getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await getCustomerReservations(req.user._id);

  res.status(200).json({
    success: true,
    count: reservations.length,
    data: reservations
  });
});

exports.cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await cancelCustomerReservation({
    reservationId: req.params.id,
    userId: req.user._id
  });

  res.status(200).json({
    success: true,
    message: 'Reservation cancelled successfully',
    data: reservation
  });
});
