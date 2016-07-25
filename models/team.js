var mongoose = require('mongoose');

var experienceSchema = new mongoose.Schema({

    experienceId: String,
    teamId: String,
    task: {
      id: String,
      title: String,
      description: String
    },
    filename: String,
    clue: {
      title: String,
      description: String
    },
    location: {
      lat: Number,
      lon: Number
    },
    order: Number,
    dateCompleted: String
  }, 
  { _id: false }
);


// for above, don't think we need the teamId 
// and for the nextExperience, the dateCompleted and filename will be null 

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
      experienceSchema
    ],
    next: experienceSchema
  }
});

module.exports = mongoose.model('Team', teamSchema);
