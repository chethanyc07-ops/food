
const CommodityService = require('../services/commodityService');

class CommodityController {
  static async list(req, res, next) {
    try {
      const { category, search, page, limit } = req.query;
      const result = await CommodityService.list({ category, search, page, limit });
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
      const commodity = await CommodityService.getById(req.params.id);
      res.status(200).json({
        success: true,
        commodity,
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const commodity = await CommodityService.create(req.body, req.user._id);
      res.status(201).json({
        success: true,
        message: 'Food commodity added successfully',
        commodity,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const commodity = await CommodityService.update(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Food commodity updated successfully',
        commodity,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const result = await CommodityService.delete(req.params.id);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CommodityController;
