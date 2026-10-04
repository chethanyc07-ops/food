const MaterialService = require('../services/materialService');

class MaterialController {
  static async list(req, res, next) {
    try {
      const { category, compostable, fssaiOnly, search, page, limit } = req.query;
      const result = await MaterialService.list({ category, compostable, fssaiOnly, search, page, limit });
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
      const material = await MaterialService.getById(req.params.id);
      res.status(200).json({
        success: true,
        material,
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const material = await MaterialService.create(req.body, req.user._id);
      res.status(201).json({
        success: true,
        message: 'Packaging material added successfully',
        material,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const material = await MaterialService.update(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Packaging material updated successfully',
        material,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const result = await MaterialService.delete(req.params.id);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MaterialController;
