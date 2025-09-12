const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['oak', 'maple', 'banyan', 'redwood', 'cherry']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  growthStage: {
    type: String,
    enum: ['seed', 'sprout', 'sapling', 'young', 'mature'],
    default: 'seed'
  },
  age: {
    type: Number,
    default: 0 // Age in days
  },
  waterLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 80
  },
  health: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  growthProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastInteraction: {
    type: Date,
    default: Date.now
  },
  lastWatered: {
    type: Date,
    default: Date.now
  },
  customization: {
    decorations: [String], // IDs of decoration items
    background: String // ID of background item
  },
  achievements: [String], // IDs of plant-specific achievements
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update age based on creation date
plantSchema.pre('save', function(next) {
  if (this.isNew) return next();
  
  const daysSinceCreation = Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
  this.age = daysSinceCreation;
  
  next();
});

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;