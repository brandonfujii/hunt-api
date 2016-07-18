var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
  location: {
    lat: Double,
    lon: Double
  },
  clue: {
    title: String,
    description: String
  }
});

module.exports = {
  Task: mongoose.model('Task', taskSchema)
}