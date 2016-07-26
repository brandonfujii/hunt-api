var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
  lat: Number,
  lon: Number,
  name: String,
  clueDescription: String
});

module.exports = mongoose.model('LocationModel', locationSchema);