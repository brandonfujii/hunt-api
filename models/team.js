var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
  name: String,
  points: Number,
  users: [
    {
      _id: String
    }
  ],
  checkpoints: [
    {
      _id: String,
      date: Date
    }
  ]
});

module.exports = {
  Team: mongoose.model('Team', teamSchema)
}