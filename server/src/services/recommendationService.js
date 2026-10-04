const Recommendation = require('../models/Recommendation');
const Commodity = require('../models/Commodity');
const Material = require('../models/Material');
const Notification = require('../models/Notification');
const RecommendationOrchestrator = require('../agents/orchestrator');

class RecommendationService {
  static async createRecommendation({
    userId,
    commodityId,
    priorities = { protection: 50, cost: 25, sustainability: 25 },
    targetShelfLifeDays,
    targetMarket = 'Domestic Retail',
    preferredPackageType = 'Any Format',
  }) {
    const commodity = await Commodity.findById(commodityId);
    if (!commodity) {
      const error = new Error('Selected commodity not found');
      error.statusCode = 404;
      throw error;
    }

    const materials = await Material.find();
    if (!materials || materials.length === 0) {
      const error = new Error('No packaging materials found in database to evaluate');
      error.statusCode = 400;
      throw error;
    }

    // Execute Multi-Agent Orchestration
    const { results, timeline, engineUsed } = await RecommendationOrchestrator.execute({
      commodity,
      materials,
      priorities,
      targetShelfLifeDays: targetShelfLifeDays || commodity.targetShelfLifeDays,
      preferredPackageType,
      targetMarket,
    });

    const recommendation = await Recommendation.create({
      user: userId,
      commodity: commodity._id,
      commoditySnapshot: {
        name: commodity.name,
        category: commodity.category,
        baselineShelfLifeDays: commodity.baselineShelfLifeDays,
        moistureSensitivity: commodity.moistureSensitivity,
        oxygenSensitivity: commodity.oxygenSensitivity,
        lightSensitivity: commodity.lightSensitivity,
        temperatureSensitivity: commodity.temperatureSensitivity,
        storageCondition: commodity.storageCondition,
        respirationRate: commodity.respirationRate,
        fatOxidationRisk: commodity.fatOxidationRisk,
      },
      priorities,
      targetShelfLifeDays: targetShelfLifeDays || commodity.targetShelfLifeDays,
      targetMarket,
      preferredPackageType,
      status: 'COMPLETED',
      agentTimeline: timeline,
      results,
      engineUsed,
    });

    // Create a notification for the user
    await Notification.create({
      user: userId,
      title: 'Recommendation Generated',
      message: `Generated top packaging recommendations for ${commodity.name} with ${results[0]?.materialSnapshot?.name || 'materials'}.`,
      type: 'success',
      link: `/recommend/${recommendation._id}`,
    });

    return recommendation;
  }

  static async list({ userId, page = 1, limit = 20 }) {
    const skip = (Number(page) - 1) * Number(limit);
    const [recommendations, total] = await Promise.all([
      Recommendation.find({ user: userId })
        .populate('commodity', 'name category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Recommendation.countDocuments({ user: userId }),
    ]);

    return {
      recommendations,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
    };
  }

  static async getById(id, userId) {
    const recommendation = await Recommendation.findOne({ _id: id, user: userId })
      .populate('commodity')
      .populate('results.material');

    if (!recommendation) {
      const error = new Error('Recommendation report not found');
      error.statusCode = 404;
      throw error;
    }
    return recommendation;
  }

  static async delete(id, userId) {
    const recommendation = await Recommendation.findOneAndDelete({ _id: id, user: userId });
    if (!recommendation) {
      const error = new Error('Recommendation not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Recommendation removed successfully', id };
  }
}

module.exports = RecommendationService;
