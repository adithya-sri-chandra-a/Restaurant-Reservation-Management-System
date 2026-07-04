const express = require('express');
const {
  getReservations,
  updateReservation,
  cancelReservation,
  getTables,
  createTable,
  deleteTable
} = require('../controllers/adminReservationController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/reservations', getReservations);
router.get('/reservations/date', getReservations);
router.patch('/reservation/:id', updateReservation);
router.delete('/reservation/:id', cancelReservation);
router.get('/tables', getTables);
router.post('/tables', createTable);
router.delete('/tables/:id', deleteTable);

module.exports = router;
