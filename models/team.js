var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
  name: String,
  points: Number,
  users: [
    {
      _id: String
    }
  ],
  completedExperiences: [
    {
      _id: String,
      date: Date,
      order: Number,
      filename: String
    }
  ]
});

module.exports = {
  Team: mongoose.model('Team', teamSchema)
}