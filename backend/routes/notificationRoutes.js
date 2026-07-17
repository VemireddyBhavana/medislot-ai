const express = require('express');
const router = express.Router();
const { createNotification, getNotifications, updateNotificationStatus } = require('../controllers/notificationController');

router.post('/create', createNotification);
router.get('/', getNotifications);
router.put('/:id', updateNotificationStatus);

module.exports = router;
