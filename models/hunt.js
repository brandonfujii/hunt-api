var mongoose = require('mongoose');

var huntSchema = mongoose.Schema({
  startDate: Date,
  endDate: Date,
  teams: [String],
  users: [String],
  taskCount: Number
});

module.exports = mongoose.model('Hunt', huntSchema)
