var mongoose = require('mongoose');

var huntSchema = mongoose.Schema({
  startDate: Date,
  endDate: Date,
  teams: [
    {
      _id: String
    }
  ],
  users: [
    {
      _id: String
    }
  ],
  tasks: [
    {
      _id: String
    }
  ]
});

module.exports = mongoose.model('Hunt', huntSchema)
