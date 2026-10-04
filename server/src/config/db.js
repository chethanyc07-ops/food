const mongoose = require('mongoose');
const config = require('./env');
const memoryStore = require('./memoryStore');

let isConnected = false;

const connectDB = async () => {
  mongoose.set('bufferCommands', false); // CRITICAL: fail fast, don't hang
  if (!config.MONGODB_URI) {
    console.log('[DB] No MONGODB_URI set. Activated Zero-Setup High-Performance In-Memory Data Store.');
    isConnected = false;
    memoryStore.isInMemory = true;
    return;
  }
  try {
    // Attempt connecting to the configured URI with a 1.5s timeout
    await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 1500,
    });
    isConnected = true;
    memoryStore.isInMemory = false;
    console.log(`[DB] Connected to MongoDB at: ${config.MONGODB_URI}`);
  } catch (err) {
    console.warn(`[DB] Primary MongoDB not available (${err.message}).`);
    console.log(`[DB] Activated Zero-Setup High-Performance In-Memory Data Store.`);
    isConnected = false;
    memoryStore.isInMemory = true;
  }
};

const disconnectDB = async () => {
  try {
    if (isConnected) {
      await mongoose.disconnect();
      console.log('[DB] Disconnected from MongoDB');
    }
  } catch (err) {
    console.error('[DB] Error during disconnection:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
