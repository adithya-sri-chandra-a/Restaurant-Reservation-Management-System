const express = require('express');
const {
  createReservation,
  getMyReservations,
  cancelReservation
} = require('../controllers/customerReservationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/create', createReservation);
router.get('/my-bookings', getMyReservations);
router.delete('/cancel/:id', cancelReservation);

module.exports = router;
