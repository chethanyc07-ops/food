const mongoose = require('mongoose');
const createModelProxy = require('./modelProxy');

const MaterialResultSchema = new mongoose.Schema({
  material: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  materialSnapshot: {
    name: String,
    category: String,
    costPerKg: Number,
    costIndex: Number,
    recyclabilityScore: Number,
    compostable: Boolean,
    otrValue: Number,
    wvtrValue: Number,
    oxygenBarrier: String,
    moistureBarrier: String,
    lightBarrier: String,
    activeScavengerType: String,
  },
  rank: {
    type: Number,
    required: true,
  },
  overallScore: {
    type: Number,
    required: true,
  },
  barrierScore: {
    type: Number,
    required: true,
  },
  costScore: {
    type: Number,
    required: true,
  },
  sustainabilityScore: {
    type: Number,
    required: true,
  },
  estimatedShelfLifeDays: {
    type: Number,
    required: true,
  },
  shelfLifeMultiplier: {
    type: Number,
    default: 1.0,
  },
  confidenceScore: {
    type: Number,
    default: 95,
  },
  strengths: [String],
  weaknesses: [String],
  packagingFormat: {
    type: String,
    default: 'Vacuum Pouch / High-Barrier Sealed Pack',
  },
  gasFlushAtmosphere: {
    type: String,
    default: 'Ambient Air',
  },
  aiExplanation: {
    type: String,
    required: true,
  },
  regulatoryNotes: {
    type: String,
  },
});

const RecommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    commodity: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    commoditySnapshot: {
      name: String,
      category: String,
      baselineShelfLifeDays: Number,
      moistureSensitivity: String,
      oxygenSensitivity: String,
      lightSensitivity: String,
      temperatureSensitivity: String,
      storageCondition: String,
      respirationRate: String,
      fatOxidationRisk: String,
    },
    priorities: {
      protection: {
        type: Number,
        default: 50,
      },
      cost: {
        type: Number,
        default: 25,
      },
      sustainability: {
        type: Number,
        default: 25,
      },
    },
    targetShelfLifeDays: {
      type: Number,
    },
    targetMarket: {
      type: String,
      default: 'Domestic Retail',
    },
    preferredPackageType: {
      type: String,
      default: 'Any Format',
    },
    status: {
      type: String,
      default: 'COMPLETED',
    },
    agentTimeline: [
      {
        agent: String,
        timestamp: { type: Date, default: Date.now },
        status: String,
        message: String,
        metadata: mongoose.Schema.Types.Mixed,
      },
    ],
    results: [MaterialResultSchema],
    engineUsed: {
      type: String,
      default: 'SCIENTIFIC_RULE_ENGINE',
    },
  },
  {
    timestamps: true,
  }
);

const RecommendationModel = mongoose.models.Recommendation || mongoose.model('Recommendation', RecommendationSchema);

module.exports = createModelProxy('Recommendation', RecommendationModel);
