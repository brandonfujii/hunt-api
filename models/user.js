var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  teamId: String, 
  points: Number,
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
  User: mongoose.model('User', userSchema)
}