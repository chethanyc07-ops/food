const mongoose = require('mongoose');
const createModelProxy = require('./modelProxy');

const CommoditySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide commodity name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'Fresh Produce',
        'Dairy',
        'Bakery',
        'Meat & Poultry',
        'Seafood',
        'Dry Foods & Spices',
        'Beverages',
        'Frozen Foods',
        'Confectionery',
        'Ready-to-Eat (RTE)',
        'Oils & Fats',
      ],
      default: 'Fresh Produce',
    },
    subCategory: {
      type: String,
      trim: true,
    },
    baselineShelfLifeDays: {
      type: Number,
      required: [true, 'Baseline shelf life in days is required'],
      min: [1, 'Shelf life must be at least 1 day'],
    },
    targetShelfLifeDays: {
      type: Number,
      default: 30,
    },
    moistureSensitivity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    oxygenSensitivity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    lightSensitivity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Low',
    },
    temperatureSensitivity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    optimalStorageTempMin: {
      type: Number,
      default: 4,
    },
    optimalStorageTempMax: {
      type: Number,
      default: 25,
    },
    respirationRate: {
      type: String,
      enum: ['None', 'Low', 'Medium', 'High', 'Very High'],
      default: 'None',
    },
    storageCondition: {
      type: String,
      enum: ['Ambient (20-25°C)', 'Chilled (0-4°C)', 'Frozen (-18°C)', 'Controlled Atmosphere (CA/MAP)'],
      default: 'Ambient (20-25°C)',
    },
    fatOxidationRisk: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Low',
    },
    targetMoistureContent: {
      type: String,
      default: '10-15%',
    },
    phRange: {
      type: String,
      default: '5.5 - 6.5',
    },
    description: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPreset: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const CommodityModel = mongoose.models.Commodity || mongoose.model('Commodity', CommoditySchema);

module.exports = createModelProxy('Commodity', CommodityModel);
