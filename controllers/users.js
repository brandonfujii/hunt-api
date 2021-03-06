var mongoose = require('mongoose'),
    User = require('../models/user'),
    _lib = require('../_lib/src');

var TeamController = require('./teams'),
    HuntController = require('./hunts');

var _ = require('underscore');


// GET /users
module.exports.getUsers = function(cb, limit) {
  User.find(cb).limit(limit);
}

// GET /users/:id
module.exports.getUserById = function(id, cb) {
  User.findById(id, cb);
}

// ADD user
module.exports.addUser = function(user, cb) {
  var username = user.name;

  User.find({ name: username }, function(err, users) {
    if (err) {
      throw err;
    }

    if (!users.length) {
      User.create(user, cb);
    } 
    else {
      cb(users[0]);
    }
  });
}

// DELETE /users/:id
module.exports.deleteUser = function(id, cb) {
  var query = { _id: id };
  User.remove(query, cb);
}

// UPDATE /users/:id
module.exports.updateUser = function(id, changes, cb) {
  User.findById(id, function(err, user) {
    if (err) {
      res.send(err);
    }
    var flattenedChanges = _lib.flattenObject(changes);
    User.update(user, { $set: flattenedChanges }, cb);
  });
}
