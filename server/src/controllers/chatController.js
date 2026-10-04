const AIChatService = require('../services/aiChatService');

class ChatController {
  static async sendMessage(req, res, next) {
    try {
      const { message, sessionId = 'default-session' } = req.body;
      const result = await AIChatService.processMessage({
        userId: req.user._id,
        sessionId,
        message,
      });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getHistory(req, res, next) {
    try {
      const { sessionId = 'default-session' } = req.query;
      const history = await AIChatService.getHistory(sessionId, req.user._id);

      res.status(200).json({
        success: true,
        history,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ChatController;
