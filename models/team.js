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
      experienceId: String,
      teamId: String,
      taskTitle: String,
      filename: String,
      clue: {
        title: String,
        description: String
      },
      location: {
        lat: Number,
        lon: Number
      }
    }
  ]
});

module.exports = {
  Team: mongoose.model('Team', teamSchema)
}