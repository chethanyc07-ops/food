const Commodity = require('../models/Commodity');
const Material = require('../models/Material');
const Recommendation = require('../models/Recommendation');
const User = require('../models/User');

class DashboardService {
  static async getSummaryStats(userId) {
    const recFilter = userId ? { user: userId } : {};
    const [
      totalCommodities,
      totalMaterials,
      totalRecommendations,
      userRecommendations,
      recentRecommendations,
      categoryDistribution,
      materialCategories,
    ] = await Promise.all([
      Commodity.countDocuments(),
      Material.countDocuments(),
      Recommendation.countDocuments(),
      Recommendation.find(recFilter).sort({ createdAt: -1 }).limit(10),
      Recommendation.find(recFilter)
        .populate('commodity', 'name category')
        .sort({ createdAt: -1 })
        .limit(5),
      Commodity.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Material.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    // Calculate average shelf-life gain from user recommendations
    let avgShelfLifeMultiplier = 2.4;
    let totalGainDays = 0;
    if (userRecommendations.length > 0) {
      let sumMult = 0;
      let count = 0;
      userRecommendations.forEach((rec) => {
        if (rec.results && rec.results[0]) {
          sumMult += rec.results[0].shelfLifeMultiplier || 1;
          totalGainDays += (rec.results[0].estimatedShelfLifeDays || 0) - (rec.commoditySnapshot?.baselineShelfLifeDays || 0);
          count++;
        }
      });
      if (count > 0) {
        avgShelfLifeMultiplier = Number((sumMult / count).toFixed(1));
      }
    }

    const compostableCount = await Material.countDocuments({ compostable: true });
    const ecoMaterialPercentage = totalMaterials > 0 ? Math.round((compostableCount / totalMaterials) * 100) : 35;

    return {
      metrics: {
        totalCommodities,
        totalMaterials,
        totalRecommendations,
        userRecommendationCount: userRecommendations.length,
        avgShelfLifeMultiplier,
        avgShelfLifeIncreasePercent: Math.round((avgShelfLifeMultiplier - 1) * 100),
        ecoMaterialPercentage,
        compostableCount,
      },
      recentRecommendations,
      categoryDistribution: categoryDistribution.map((c) => ({ category: c._id, count: c.count })),
      materialCategories: materialCategories.map((m) => ({ category: m._id, count: m.count })),
    };
  }
}

module.exports = DashboardService;
