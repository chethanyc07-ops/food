const mongoose = require('mongoose');
const createModelProxy = require('./modelProxy');

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

module.exports = createModelProxy('Notification', NotificationModel);
