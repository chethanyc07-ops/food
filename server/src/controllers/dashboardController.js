const DashboardService = require('../services/dashboardService');

class DashboardController {
  static async getSummary(req, res, next) {
    try {
      const userId = req.user ? req.user._id : null;
      const summary = await DashboardService.getSummaryStats(userId);
      res.status(200).json({
        success: true,
        summary,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DashboardController;
