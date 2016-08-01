var mongoose = require('mongoose'),
    Task = require('../models/task'),
    _lib = require('../_lib/src');

// GET /tasks 
module.exports.getTasks = function(cb, limit) {
  Task.find(cb).limit(limit);
}

// GET /tasks/:id
module.exports.getTaskById = function(id, cb) {
  Task.findById(id, cb);
}

// POST /tasks
module.exports.addTask = function(task, cb) {
  Task.create(task, cb);
}

// DELETE /tasks/:id
module.exports.deleteTask = function(id, cb) {
  var query = { _id: id };
  Task.remove(query, cb);
}

// UPDATE /tasks/:id
module.exports.updateTask = function(id, changes, cb) {
  Task.findById(id, function(err, task) {
    if (err) {
      res.send(err);
    }
    var flattenedChanges = _lib.flattenObject(changes);
    Task.update(task, { $set: flattenedChanges }, cb);
  });
}
