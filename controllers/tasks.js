var mongoose = require('mongoose'),
    TaskModel = require('../models/task');

// GET /tasks 
module.exports.getTasks = function(cb, limit) {
  TaskModel.Task.find(cb).limit(limit);
}

// GET /tasks/:id
module.exports.getTaskById = function(id, cb) {
  TaskModel.Task.findById(id, cb);
}

// POST /tasks
module.exports.addTask = function(task, cb) {
  TaskModel.Task.create(task, cb);
}

// DELETE /tasks/:id
module.exports.deleteTask = function(id, cb) {
  var query = { _id: id };
  TaskModel.Task.remove(query, cb);
}

// UPDATE /tasks/:id
module.exports.updateTask = function(id, task, options, cb) {
  var query = { _id: id };
  var updated_task = {
    experienceId: task.experienceId,
    title: task.title,
    description: task.description
  };
  TaskModel.Task.findOneAndUpdate(query, updated_task, options, cb);
}

