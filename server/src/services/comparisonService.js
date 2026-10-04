const Commodity = require('../models/Commodity');
const Material = require('../models/Material');
const BarrierEvaluationAgent = require('../agents/barrierEvaluationAgent');
const ShelfLifeAgent = require('../agents/shelfLifeAgent');
const ComplianceAgent = require('../agents/complianceAgent');
const SustainabilityAgent = require('../agents/sustainabilityAgent');
const PlannerAgent = require('../agents/plannerAgent');

class ComparisonService {
  static async compareMaterials({ commodityId, materialIds }) {
    if (!materialIds || materialIds.length < 2 || materialIds.length > 4) {
      const error = new Error('Please select between 2 and 4 materials to compare');
      error.statusCode = 400;
      throw error;
    }

    const commodity = await Commodity.findById(commodityId);
    if (!commodity) {
      const error = new Error('Selected commodity not found');
      error.statusCode = 404;
      throw error;
    }

    const materials = await Material.find({ _id: { $in: materialIds } });
    if (materials.length < 2) {
      const error = new Error('Could not find all selected materials');
      error.statusCode = 404;
      throw error;
    }

    const plan = await PlannerAgent.plan({
      commodity,
      priorities: { protection: 40, cost: 30, sustainability: 30 },
      targetShelfLifeDays: commodity.targetShelfLifeDays,
      preferredPackageType: 'Any Format',
    });

    const comparisons = materials.map((material) => {
      const barrier = BarrierEvaluationAgent.evaluate({ commodity, material, plan });
      const shelfLife = ShelfLifeAgent.predict({ commodity, material, barrierResult: barrier });
      const compliance = ComplianceAgent.evaluate({ commodity, material });
      const sustainability = SustainabilityAgent.evaluate({ material });

      const compositeScore = Math.round(
        barrier.aggregateBarrierScore * 0.4 +
          sustainability.costScore * 0.3 +
          sustainability.sustainabilityScore * 0.3 -
          (compliance.isCompliant ? 0 : 20)
      );

      return {
        material,
        compositeScore: Math.max(10, Math.min(100, compositeScore)),
        barrierScore: barrier.aggregateBarrierScore,
        breakdown: barrier.breakdown,
        shelfLifeDays: shelfLife.estimatedShelfLifeDays,
        shelfLifeMultiplier: shelfLife.shelfLifeExtensionMultiplier,
        costScore: sustainability.costScore,
        costPerKg: material.costPerKg,
        sustainabilityScore: sustainability.sustainabilityScore,
        recyclabilityScore: material.recyclabilityScore,
        compostable: material.compostable,
        compliance: compliance,
        radarDimensions: {
          oxygenBarrier: barrier.breakdown.o2Score,
          moistureBarrier: barrier.breakdown.moistureScore,
          lightBarrier: barrier.breakdown.lightScore,
          costEfficiency: sustainability.costScore,
          sustainability: sustainability.sustainabilityScore,
          shelfLifeImpact: Math.min(100, Math.round(shelfLife.shelfLifeExtensionMultiplier * 20)),
        },
      };
    });

    // Find the best in each category
    const bestProtection = [...comparisons].sort((a, b) => b.barrierScore - a.barrierScore)[0];
    const bestEco = [...comparisons].sort((a, b) => b.sustainabilityScore - a.sustainabilityScore)[0];
    const bestCost = [...comparisons].sort((a, b) => b.costScore - a.costScore)[0];
    const bestOverall = [...comparisons].sort((a, b) => b.compositeScore - a.compositeScore)[0];

    return {
      commodity,
      comparisons,
      summary: {
        bestProtection: { materialName: bestProtection.material.name, score: bestProtection.barrierScore },
        bestEco: { materialName: bestEco.material.name, score: bestEco.sustainabilityScore },
        bestCost: { materialName: bestCost.material.name, score: bestCost.costScore },
        bestOverall: { materialName: bestOverall.material.name, score: bestOverall.compositeScore },
      },
    };
  }
}

module.exports = ComparisonService;
