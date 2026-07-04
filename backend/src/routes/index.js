const express = require('express');
const authRoutes = require('./authRoutes');
const reservationRoutes = require('./reservationRoutes');
const customerReservationRoutes = require('./customerReservationRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/reservations', reservationRoutes);
router.use('/reservation', customerReservationRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
