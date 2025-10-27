const mongoose = require('mongoose');

const simulationResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  challenge: {
    type: String,
    required: true,
  },
  timeAchieved: {
    type: Number,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const SimulationResult = mongoose.model('SimulationResult', simulationResultSchema);

module.exports = SimulationResult;
