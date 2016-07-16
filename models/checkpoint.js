var mongoose = require('mongoose');

var checkpointSchema = mongoose.Schema({
  location: {
    lat: Double,
    lon: Double
  },
  clue: {
    description: String
  },
  title: String,
  description: String
});

module.exports = {
  Checkpoint: mongoose.model('Checkpoint', checkpointSchema)
}