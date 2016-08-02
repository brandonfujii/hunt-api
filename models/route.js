var mongoose = require('mongoose');

var routeSchema = mongoose.Schema({
  teamId: String,
  order: Number,
  locations: [
    {
      _id: String,
      lat: Number,
      lon: Number,
      clueDescription: String,
      radius: Number
    }
  ]
});

module.exports = mongoose.model('Route', routeSchema);

