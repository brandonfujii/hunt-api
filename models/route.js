var mongoose = require('mongoose');

var routeSchema = mongoose.Schema({
  teamId: String,
  name: String,
  locations: [
    {
      _id: String,
      order: Number,
      name: String,
      lat: Number,
      lon: Number,
      clueDescription: String,
      radius: Number
    }
  ]
});

module.exports = mongoose.model('Route', routeSchema);

