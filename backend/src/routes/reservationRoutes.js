const express = require('express');
const { createReservation } = require('../controllers/reservationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createReservation);

module.exports = router;
