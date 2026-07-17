const Notification = require('../models/Notification');

// @route   POST /api/notifications/create
exports.createNotification = async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    const saved = await newNotification.save();
    res.status(201).json({ message: 'Notification created successfully', notification: saved });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @route   GET /api/notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate('appointmentId').sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @route   PUT /api/notifications/:id
exports.updateNotificationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification status updated successfully', notification: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
