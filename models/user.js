var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  teamId: String, 
  points: Number
});

module.exports = {
  User: mongoose.model('User', userSchema)
}