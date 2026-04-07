const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema(
  {
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true
  },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    timeMorning: {
      type: String,
      required: true,
      trim: true,
    },

    timeAfternoon: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },

    description: {
      type: String,
      default: "",
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stop", stopSchema);
