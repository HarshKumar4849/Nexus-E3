// FILE: backend/models/RouteModel.js

const mongoose = require("mongoose");

const coordinateSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { _id: false });

const stopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coordinates: coordinateSchema,
  sequenceOrder: { type: Number },
  arrivalTime: { type: String, default: null }
}, { _id: false });

const routeSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  busName: { type: String, required: true },
  routeName: { type: String, required: true, unique: true }, // FIXED: BUG 3 Route Uniqueness
  startPoint: {
    name: { type: String, required: true },
    coordinates: coordinateSchema
  },
  stoppages: [stopSchema],
  endPoint: {
    name: { type: String, required: true },
    coordinates: coordinateSchema
  },
  classTime: { type: String },
  arrivalBus: { type: String },
  drivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
  remarks: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Route", routeSchema);
