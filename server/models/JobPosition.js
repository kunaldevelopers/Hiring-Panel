const mongoose = require("mongoose");

const jobPositionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [
    {
      type: String,
      required: true,
    },
  ],
  totalPositions: {
    type: Number,
    required: true,
    min: 1,
  },
  filledPositions: {
    type: Number,
    default: 0,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate available positions
jobPositionSchema.virtual("availablePositions").get(function () {
  return this.totalPositions - this.filledPositions;
});

// Update the updatedAt field before saving
jobPositionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("JobPosition", jobPositionSchema);
