var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  teamId: String, 
  points: Number,
  checkpoints: [
    {
      _id: String, 
      date: Date
    }
  ]
});

module.exports = {
  User: mongoose.model('User', userSchema)
}