const express = require('express');
const { body } = require('express-validator');
const ChatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.post(
  '/message',
  protect,
  [body('message').trim().notEmpty().withMessage('Message content cannot be empty')],
  validate,
  ChatController.sendMessage
);

router.get('/history', protect, ChatController.getHistory);

module.exports = router;
