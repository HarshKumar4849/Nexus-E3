const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const routeSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: true,
    unique: true
  },
  routeCode: {
    type: String,
    required: true,
    unique: true
  },
  routeName: {
    type: String,
    required: true
  },
  // BusNo1:{
  //   type: String,
  //   required: true
  // },
  // BusNo2:{
  //   type: String,
  //   required: true
  // },
  // DriverContact1: {
  //   type: String,
  //   required: true
  // },
  // DriverContact2: {
  //   type: String,
  //   required: true
  // }
});

module.exports = mongoose.model("Route", routeSchema);
