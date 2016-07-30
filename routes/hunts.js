var express        = require('express'),
    HuntRouter     = express.Router(),
    HuntController = require('../controllers/hunts'),
    TeamController = require('../controllers/teams'),
    ObjectID       = require('bson-objectid'),
    firebaseApp    = require('../utils/firebase');

// GET /hunts
HuntRouter.get('/', function(req, res, next) {
  HuntController.getHunts(function(err, hunts) {
    if (err) {
      res.send(err);
    }
    res.json(hunts);
  });
});

// POST /hunts/create
HuntRouter.post('/create', function(req, res) {
  var newHunt = req.body;
  HuntController.addHunt(newHunt, function(err, newHunt) {
    if (err) {
      res.send(err);
    }
    res.json(newHunt);
  })
});

// GET /hunts/team/:id
HuntRouter.get('/team/:_id', function(req, res) {
  HuntController.getHuntByTeamId(req.params._id, function(err, hunt) {
    if (err) {
      throw err;
    }
    console.log(hunt)
    res.json(hunt);
  });
});

// GET /hunts/:id
HuntRouter.get('/:_id', function(req, res, next) {
  HuntController.getHuntById(req.params._id, function(err, hunt) {
    if (err) {
      throw err;
    }
    res.json(hunt);
  });
});

// PUT /hunts/:id
HuntRouter.put('/:_id', function(req, res) {
  var id = req.params._id;
  var changes = req.body;
  HuntController.updateHunt(id, changes, function(err) {
    if (err) {
      res.send(err);
    }
    res.json({ status: true });
  });
});

// DELETE /hunts/:id
HuntRouter.delete('/:_id', function(req, res) {
  var id = req.params._id;
  HuntController.deleteHunt(id, function(err) {
    if (err) {
      res.send(err);
    }
    res.json({ status: true });
  });
});

// Start Hunt /hunts/start/:id
HuntRouter.post('/start/:_id', function(req, res) {
  var id            = req.params._id,
      isGameStarted = req.body.isGameStarted,
      currLocation  = req.body.location;

  if (!isGameStarted) {
    HuntController.getHuntById(id, function(err, hunt) {
      if (err) {
        res.send({ "error" : 'Could not find hunt'});
      }

      if (hunt.teams) {
        hunt.teams.map(function(team_id) {
          var teamId = team_id;
          TeamController.generateInitialExperience(teamId, currLocation, function(err, nextExperience, currentTeam) {
            var updatedTeam = currentTeam;
            updatedTeam['experiences']['next'] = nextExperience;

            TeamController.replaceTeam(teamId, updatedTeam, {}, function(err, team) {
              firebaseApp.database().ref('teams/' + teamId + '/refreshTeam').set(ObjectID());
              console.log("Team Updated");
            });
          });
        });

        res.send({ "isGameStarted" : true });
      } else {
        res.send({ "error" : "No teams are participating in this hunt!"});
      }
    });
  } else {
    res.send({ "error" : 'Sorry, the hunt has already started!'});
  }
});

module.exports = HuntRouter;
