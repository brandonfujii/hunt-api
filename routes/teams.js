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
  var experienceId = req.body.experienceId,
      fileName     = req.body.filename,
      teamId       = req.params._id;

  // get TEAM
  TeamController.getTeamById(teamId, function(err, team) {
    if (err) {
      res.send(err);
    }
    else {
      var completedExperience = team.experiences.next,
          currentStory        = team.experiences.completed;

      var updatedExperience = {
        _id: completedExperience._id,
        task: completedExperience.task,
        location: completedExperience.location,
        filename: fileName,
        order: completedExperience.order,
        dateCompleted: Date.now()
      }

      var updatedStory = currentStory.concat([updatedExperience]);
      var updatedTeam = team;
      updatedTeam['experiences']['completed'] = updatedStory;

      TeamController.generateNextExperienceByTeamId(teamId, completedExperience, function(err, nextExperience) {
        updatedTeam['experiences']['next'] = nextExperience;
        
        TeamController.replaceTeam(teamId, updatedTeam, {}, function(err, team) {
          TeamController.getTeams(function(err, teams) {
            res.json(teams);
          });
        });
      });
    }
  });

});

//   LocationController.getExperienceById(experienceId, function(err, experience) {
//     var location = experience.location,
//         clue = experience.clue;

//     TaskController.getTaskById(taskId, function(err, task) {
//       if (err) {
//         res.send(err);
//       }
//       var taskTitle = task.title;
//       var newCompletedExperience = {
//           experienceId: experienceId,
//           teamId: teamId,
//           filename: fileName,
//           taskTitle: taskTitle,
//           clue: clue,
//           location: location
//       };

//       // Update the team object's completedExperiences (byTeamId)
//       TeamController.updateCompletedExperiencesById(teamId, newCompletedExperience, {}, function(err, experience) {
//         if (err) {
//           res.send(err);
//         }

//         TeamController.generateNextExperienceByTeamId(teamId, newCompletedExperience, function(responseObject) {
//           res.json(responseObject);
//         });
//       });
//     });
//   });
// });

module.exports = TeamRouter;
