const express = require('express');
const NotificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, NotificationController.list);
router.post('/read-all', protect, NotificationController.markAllAsRead);

module.exports = router;
