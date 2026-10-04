const RecommendationService = require('../services/recommendationService');

class RecommendationController {
  static async create(req, res, next) {
    try {
      const { commodityId, priorities, targetShelfLifeDays, targetMarket, preferredPackageType } = req.body;
      const recommendation = await RecommendationService.createRecommendation({
        userId: req.user._id,
        commodityId,
        priorities,
        targetShelfLifeDays,
        targetMarket,
        preferredPackageType,
      });

      res.status(201).json({
        success: true,
        message: 'Intelligent packaging recommendation generated successfully',
        recommendation,
      });
    } catch (err) {
      next(err);
    }
  }

  static async list(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await RecommendationService.list({
        userId: req.user._id,
        page,
        limit,
      });
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const recommendation = await RecommendationService.getById(req.params.id, req.user._id);
      res.status(200).json({
        success: true,
        recommendation,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const result = await RecommendationService.delete(req.params.id, req.user._id);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = RecommendationController;
