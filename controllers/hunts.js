var mongoose = require('mongoose'),
    HuntModel = require('../models/hunt');

// GET /hunts
module.exports.getHunts = function(cb, limit) {
  HuntModel.Hunt.find(cb).limit(limit);
}

// GET /hunts/:id
module.exports.getUserById = function(id, cb) {
  HuntModel.Hunt.findById(id, cb);
}

// POST /hunts
module.exports.addHunt = function(hunt, cb) {
  HuntModel.Hunt.create(user, cb);
}

// DELETE /users/:id
module.exports.deleteUser = function(id, cb) {
  var query = { _id: id };
  HuntModel.Hunt.remove(query, cb);
}

// UPDATE /users/:id
module.exports.updateUser = function(id, hunt, options, cb) {
  var query = { _id: id };
  var updated_hunt = {
    startDate: hunt.startDate,
    endDate: hunt.endDate,
    teams: hunt.teams,
    users: hunt.users,
    tasks: hunt.tasks
  };
  HuntModel.Hunt.findOneAndUpdate(query, updated_hunt, options, cb);
}

module.exports.getHuntTasks = function() {
  return HuntModel.Hunt.find('tasks');
}