var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
  experienceId: String,
  title: String,
  description: String
});

module.exports = {
  Task: mongoose.model('Task', taskSchema)
}