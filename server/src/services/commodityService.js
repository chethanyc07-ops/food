const Commodity = require('../models/Commodity');

class CommodityService {
  static async list({ category, search, page = 1, limit = 50 }) {
    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subCategory: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [commodities, total] = await Promise.all([
      Commodity.find(query).sort({ name: 1 }).skip(skip).limit(Number(limit)),
      Commodity.countDocuments(query),
    ]);

    return {
      commodities,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
    };
  }

  static async getById(id) {
    const commodity = await Commodity.findById(id);
    if (!commodity) {
      const error = new Error('Commodity not found');
      error.statusCode = 404;
      throw error;
    }
    return commodity;
  }

  static async create(data, userId) {
    return await Commodity.create({
      ...data,
      createdBy: userId,
    });
  }

  static async update(id, data) {
    const commodity = await Commodity.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!commodity) {
      const error = new Error('Commodity not found');
      error.statusCode = 404;
      throw error;
    }
    return commodity;
  }

  static async delete(id) {
    const commodity = await Commodity.findByIdAndDelete(id);
    if (!commodity) {
      const error = new Error('Commodity not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Commodity removed successfully', id };
  }
}

module.exports = CommodityService;
