var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
  title: String,
  description: String,
  points: Number
});

module.exports = mongoose.model('Task', taskSchema);
