const mongoose = require('mongoose');
const createModelProxy = require('./modelProxy');

const MaterialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide material name'],
      trim: true,
    },
    tradeName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'Flexible Plastic (Polyolefins)',
        'High-Barrier Barrier Laminate',
        'Biodegradable & Bio-polymers',
        'Metal & Aluminium Foil Laminate',
        'Rigid Plastic & Containers',
        'Glass & Hermetic Containers',
        'Paper & Coated Paperboard',
        'Active & MAP Smart Packaging',
      ],
      default: 'Flexible Plastic (Polyolefins)',
    },
    description: {
      type: String,
      trim: true,
    },
    oxygenBarrier: {
      type: String,
      enum: ['Poor', 'Fair', 'Good', 'Excellent', 'Superior (Zero OTR)'],
      default: 'Good',
    },
    otrValue: {
      type: Number,
      required: [true, 'OTR value is required'],
    },
    moistureBarrier: {
      type: String,
      enum: ['Poor', 'Fair', 'Good', 'Excellent', 'Superior (Zero WVTR)'],
      default: 'Good',
    },
    wvtrValue: {
      type: Number,
      required: [true, 'WVTR value is required'],
    },
    lightBarrier: {
      type: String,
      enum: ['Transparent (0%)', 'Low (20-40%)', 'Moderate (40-70%)', 'High (70-95%)', 'Total Opaque (100%)'],
      default: 'Moderate (40-70%)',
    },
    lightTransmissionPercent: {
      type: Number,
      default: 30,
    },
    minTemp: {
      type: Number,
      default: -20,
    },
    maxTemp: {
      type: Number,
      default: 100,
    },
    costIndex: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    costPerKg: {
      type: Number,
      default: 250,
    },
    recyclabilityScore: {
      type: Number,
      min: 1,
      max: 10,
      default: 7,
    },
    compostable: {
      type: Boolean,
      default: false,
    },
    biodegradationDays: {
      type: Number,
      default: 0,
    },
    fdaApproved: {
      type: Boolean,
      default: true,
    },
    fssaiCompliant: {
      type: Boolean,
      default: true,
    },
    activeScavengerType: {
      type: String,
      enum: ['None', 'Oxygen Scavenger', 'Moisture Absorber / Desiccant', 'Ethylene Absorber', 'Antimicrobial / Essential Oil Coating', 'CO2 Emitter'],
      default: 'None',
    },
    punctureResistance: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Ultra High'],
      default: 'High',
    },
    tensileStrengthMpa: {
      type: Number,
      default: 50,
    },
    applications: [
      {
        type: String,
        trim: true,
      },
    ],
    sustainabilityNotes: {
      type: String,
      trim: true,
    },
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

const MaterialModel = mongoose.models.Material || mongoose.model('Material', MaterialSchema);

module.exports = createModelProxy('Material', MaterialModel);
