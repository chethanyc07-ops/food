const ComparisonService = require('../services/comparisonService');

class ComparisonController {
  static async compare(req, res, next) {
    try {
      const { commodityId, materialIds } = req.body;
      const result = await ComparisonService.compareMaterials({
        commodityId,
        materialIds,
      });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ComparisonController;
