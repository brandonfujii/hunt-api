var express        = require('express'),
    TeamRouter     = express.Router(),
    TeamController = require('../controllers/teams'),
    TaskController = require('../controllers/tasks'),
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

// COMPLETE /complete/:id
TeamRouter.post('/complete/:_id', function(req, res, next) {
  var userId       = req.body.userId,
      taskId       = req.body.taskId,
      fileName     = req.body.filename,
      experienceId = req.params._id;

  LocationController.updateOnVideoUpload(userId, fileName, experienceId, taskId, function(err, team) {
    if (err) {
      res.send(err);
    }
    var teamId = team._id;
    LocationController.getExperienceById(experienceId, function(err, experience) {
      var location = experience.location,
          clue = experience.clue;

      TaskController.getTaskById(taskId, function(err, task) {
        if (err) {
          res.send(err);
        }
        var taskTitle = task.title;
        var newCompletedExperience = {
            experienceId: experienceId,
            teamId: teamId,
            filename: fileName,
            taskTitle: taskTitle,
            clue: clue,
            location: location
        };

        // Update the team object's completedExperiences (byTeamId)
        TeamController.updateCompletedExperiencesById(teamId, newCompletedExperience, {}, function(err, experience) {
          if (err) {
            res.send(err);
          }

          TeamController.generateNextExperienceByTeamId(teamId, newCompletedExperience, function(responseObject) {

            res.json(responseObject);
          });
        });
      });
    });
  });
});

module.exports = TeamRouter;
