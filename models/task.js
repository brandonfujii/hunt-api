var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
  experienceId: String,
  title: String,
  description: String
});

module.exports = mongoose.model('Task', taskSchema);