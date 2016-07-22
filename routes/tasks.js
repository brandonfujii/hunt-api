var express        = require('express'),
    TaskRouter     = express.Router(),
    TaskController = require('../controllers/tasks');

// GET /tasks
TaskRouter.get('/', function(req, res, next) {
  TaskController.getTasks(function(err, tasks) {
    if (err) {
      res.send(err);
    }
    res.json(tasks);
  });
});

// POST /teams/create
TaskRouter.post('/create', function(req, res) {
  var newTask = req.body;
  TaskController.addTask(newTask, function(err, newTask) {
    if (err) {
      res.send(err);
    }
    res.json(newTask);
  })
});

// GET /tasks/:id
TaskRouter.get('/:_id', function(req, res, next) {
  TaskController.getTaskById(req.params._id, function(err, task) {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
});

// PUT /tasks/:id
TaskRouter.put('/:_id', function(req, res) {
  var id = req.params._id;
  var task = req.body;
  TaskController.updateTask(id, task, {}, function(err, task) {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
});

// DELETE /tasks/:id
TaskRouter.delete('/:_id', function(req, res) {
  var id = req.params._id;
  TaskController.deleteTask(id, function(err, task) {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
});


module.exports = TaskRouter;
