const express = require('express');
const { register, login, getMe, getAdminDashboard } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.get('/admin', authMiddleware, roleMiddleware('admin'), getAdminDashboard);

module.exports = router;
