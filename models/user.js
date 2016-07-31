var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  teamId: String
});

module.exports = mongoose.model('User', userSchema)
