var mongoose = require('mongoose');

var experienceSchema = mongoose.Schema({
  location: {
    lat: Number,
    lon: Number,
    name: String
  },
  clue: {
    title: String,
    description: String
  },
  task: {
    title: String,
    description: String
  }
});

module.exports = {
  Experience: mongoose.model('Experience', experienceSchema)
}