const Reservation = require('../models/Reservation');

const getReservationExpiry = (reservationDate, timeSlot) => {
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const expiry = new Date(reservationDate);
  expiry.setHours(hours, minutes, 0, 0);
  expiry.setHours(expiry.getHours() + 1);
  return expiry;
};

const cleanupExpiredReservations = async () => {
  const now = new Date();
  const activeReservations = await Reservation.find({ status: 'active' });

  const expiredIds = activeReservations
    .filter((reservation) => now >= getReservationExpiry(reservation.reservationDate, reservation.timeSlot))
    .map((reservation) => reservation._id);

  if (!expiredIds.length) {
    return { expiredCount: 0, expiredIds: [] };
  }

  const result = await Reservation.updateMany(
    { _id: { $in: expiredIds } },
    { $set: { status: 'cancelled' } }
  );

  return { expiredCount: result.modifiedCount, expiredIds };
};

module.exports = {
  cleanupExpiredReservations,
  getReservationExpiry
};
