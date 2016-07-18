var mongoose = require('mongoose'),
    UserModel = require('../models/user');

var TeamController = require('./teams'),
    HuntController = require('./hunts');

var _ = require('underscore');


// GET /users
module.exports.getUsers = function(cb, limit) {
  UserModel.User.find(cb).limit(limit);
}

// GET /users/:id
module.exports.getUserById = function(id, cb) {
  UserModel.User.findById(id, cb);
  HuntController.getHuntTasks()
    .then(function(tasks) {
      console.log(tasks);
    });
}

// ADD user
module.exports.addUser = function(user, cb) {
  UserModel.User.create(user, cb);
}

// DELETE /users/:id
module.exports.deleteUser = function(id, cb) {
  var query = { _id: id };
  UserModel.User.remove(query, cb);
}

// UPDATE /users/:id
module.exports.updateUser = function(id, user, options, cb) {
  var query = { _id: id };
  var updated_user = {
    name: user.name,
    teamId: user.teamId,
    points: user.points,
    checkpoints: user.checkpoints
  };
  UserModel.User.findOneAndUpdate(query, updated_user, options, cb);
}

module.exports.checkUserIn = function(id, user, checkpoint, options, cb) {
  TeamController.getTeamByUserId(id)
    .then(function(team) {
      var updated_team_checkpoints = team.checkpoints.concat([checkpoint]),
          updated_user_checkpoints = user.checkpoints.concat([checkpoint]);

      // TODO: create updated_team
      // TODO: create updated_user
      // Update user and team
    });
  // var query = { _id: id };
  // var team = getTeamByUserId(user._id);

  // var updated_checkpoints = user.concat([checkpoint]);
  // var updated_user = {
  //   name: user.name,
  //   teamId: user.team,
  //   points: user.points,
  //   checkpoints
  // }

  // var updated_team = {
  //   name: 
  // }
}

