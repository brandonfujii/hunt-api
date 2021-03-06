var mongoose = require('mongoose');

var experienceSchema = new mongoose.Schema({
    task: {
      _id: String,
      title: String,
      description: String,
      points: Number,
      locationId: [String]
    },
    location: {
      _id: String,
      lat: Number,
      lon: Number,
      name: String,
      radius: Number,
      clueDescription: String
    },
    filename: String,
    order: Number,
    dateCompleted: Date
});

var teamSchema = mongoose.Schema({
  name: String,
  points: Number,
  users: [
    {
      _id: String,
      name: String,
      teamId: String
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
