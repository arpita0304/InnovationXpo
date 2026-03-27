const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true,
      trim: true
    },
    photo: {
      type: String
    },
    lastSeenLocation: {
      type: String
    },
    lastSeenTime: {
      type: Date
    },
    cameraMatched: {
      type: String
    },
    zoneStatus: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Case", caseSchema);