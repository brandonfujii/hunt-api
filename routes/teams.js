var express        = require('express'),
    TeamRouter     = express.Router(),
    TeamController = require('../controllers/teams'),
    firebaseApp    = require('../utils/firebase');

// GET /teams
TeamRouter.get('/', function(req, res, next) {
  TeamController.getTeams(function(err, teams) {
    if (err) {
      res.send(err);
    }
    res.json(teams);
  })
});

// POST /teams/create
TeamRouter.post('/create', function(req, res) {
  var newTeam = req.body;
  TeamController.addTeam(newTeam, function(err, newTeam) {
    if (err) {
      res.send(err);
    }
    res.json(newTeam);
  })
});

// GET /teams/:_id
TeamRouter.get('/:_id', function(req, res) {
  TeamController.getTeamById(req.params._id, function(err, team) {
    if (err) {
      res.send(err);
    }
    res.json(team);
  });
});

// PUT /teams/:id
TeamRouter.put('/:_id', function(req, res) {
  var id = req.params._id;
  var changes = req.body;

  TeamController.updateTeam(id, changes, function(err) {
    if (err) {
      res.send(err);
    }
    res.json({ status: true });
  });
});

// DELETE /teams/:id
TeamRouter.delete('/:_id', function(req, res) {
  var id = req.params._id;
  TeamController.deleteTeam(id, function(err, team) {
    if (err) {
      res.send(err);
    }
    res.json({ status: true });
  });
});

module.exports = TeamRouter;
