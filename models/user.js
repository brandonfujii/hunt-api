var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  fbId: String,
  teamId: String
});

module.exports = mongoose.model('User', userSchema)
