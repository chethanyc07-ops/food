const mongoose = require('mongoose');
const createModelProxy = require('./modelProxy');

const ChatMessageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    referencedCommodity: {
      type: mongoose.Schema.Types.Mixed,
    },
    referencedMaterials: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const ChatMessageModel = mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);

module.exports = createModelProxy('ChatMessage', ChatMessageModel);
