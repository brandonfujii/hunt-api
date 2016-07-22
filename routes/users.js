var express        = require('express'),
    UserRouter     = express.Router(),
    UserController = require('../controllers/users');

// GET /users
UserRouter.get('/', function(req, res, next) {
  UserController.getUsers(function(err, users) {
    if (err) {
      res.send(err);
    }
    res.json(users);
  })
});

// POST /users/create
UserRouter.post('/create', function(req, res) {
  var newUser = req.body;
  UserController.addUser(newUser, function(err, newUser) {
    if (err) {
      res.send(err);
    }
    res.json(newUser);
  })
});

// GET /users/:_id
UserRouter.get('/:_id', function(req, res) {
  UserController.getUserById(req.params._id, function(err, user) {
    if (err) {
      res.send(err);
    }
    res.json(user);
  });
});

// PUT /users/:id
UserRouter.put('/:_id', function(req, res) {
  var id = req.params._id;
  var user = req.body;
  UserController.updateUser(id, user, {}, function(err, user) {
    if (err) {
      res.send(err);
    }
    res.json(user);
  });
});

// DELETE /teams/:id
UserRouter.delete('/:_id', function(req, res) {
  var id = req.params._id;
  UserController.deleteUser(id, function(err, user) {
    if (err) {
      res.send(err);
    }
    res.json(user);
  });
});

module.exports = UserRouter;
