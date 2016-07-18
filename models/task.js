var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
  location: {
    lat: Number,
    lon: Number,
    name: String
  }
});

module.exports = {
  Task: mongoose.model('Task', taskSchema)
}