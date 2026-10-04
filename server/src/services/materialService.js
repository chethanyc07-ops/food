const Material = require('../models/Material');

class MaterialService {
  static async list({ category, compostable, fssaiOnly, search, page = 1, limit = 50 }) {
    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (compostable === 'true') {
      query.compostable = true;
    }
    if (fssaiOnly === 'true') {
      query.fssaiCompliant = true;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tradeName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { applications: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [materials, total] = await Promise.all([
      Material.find(query).sort({ recyclabilityScore: -1, name: 1 }).skip(skip).limit(Number(limit)),
      Material.countDocuments(query),
    ]);

    return {
      materials,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
    };
  }

  static async getById(id) {
    const material = await Material.findById(id);
    if (!material) {
      const error = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }
    return material;
  }

  static async create(data, userId) {
    return await Material.create({
      ...data,
      createdBy: userId,
    });
  }

  static async update(id, data) {
    const material = await Material.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!material) {
      const error = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }
    return material;
  }

  static async delete(id) {
    const material = await Material.findByIdAndDelete(id);
    if (!material) {
      const error = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Material removed successfully', id };
  }
}

module.exports = MaterialService;
