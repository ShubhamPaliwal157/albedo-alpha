const mongoose = require('mongoose');

const plantMemorySchema = new mongoose.Schema({
  plant: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g., 'watering', 'purchase', 'achievement', 'milestone', 'custom'
  details: { type: String }, // summary or crucial detail
  timestamp: { type: Date, default: Date.now }
});

const PlantMemory = mongoose.model('PlantMemory', plantMemorySchema);

module.exports = PlantMemory;
