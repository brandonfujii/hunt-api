var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
  name: String,
  points: Number,
  users: [
    {
      _id: String
    }
  ],
  experiences: {
    completed: [ 
      new mongoose.Schema({

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
      }, {_id: false})
    ],
    nextExperience: {
      experienceId: String,
      taskId: String,
      date: Date,
      order: Number,
      filename: String
    }
  }
});

module.exports = {
  Team: mongoose.model('Team', teamSchema)
}