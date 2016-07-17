var mongoose = require('mongoose');

var gameSchema = mongoose.Schema({
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
  checkpoints: [
    {
      _id: String
    }
  ]
});

module.exports = {
  Game: mongoose.model('Game', gameSchema)
}