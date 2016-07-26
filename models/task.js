var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
  title: String,
  description: String
});

module.exports = mongoose.model('Task', taskSchema);