const Notification = require('../models/Notification');

class NotificationController {
  static async list(req, res, next) {
    try {
      const notifications = await Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(20);
      const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });

      res.status(200).json({
        success: true,
        notifications,
        unreadCount,
      });
    } catch (err) {
      next(err);
    }
  }

  static async markAllAsRead(req, res, next) {
    try {
      await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
      res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = NotificationController;
