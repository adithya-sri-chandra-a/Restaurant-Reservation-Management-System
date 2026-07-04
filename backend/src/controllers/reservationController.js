const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { createReservation } = require('../services/reservationService');

exports.createReservation = asyncHandler(async (req, res, next) => {
  const reservation = await createReservation({
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
