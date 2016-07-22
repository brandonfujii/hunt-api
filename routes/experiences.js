var express              = require('express'),
    ExperienceRouter     = express.Router(),
    ExperienceController = require('../controllers/experiences'),
    TaskController       = require('../controllers/tasks'),
    TeamController       = require('../controllers/teams'),
    Experience           = require('../models/experience');

// GET /experiences
ExperienceRouter.get('/', function(req, res, next) {
  ExperienceController.getExperiences(function(err, experiences) {
    if (err) {
      res.send(err);
    }

    res.json(experiences);
  });
});

// POST /experiences/create
ExperienceRouter.post('/create', function(req, res) {
  var newExperience = req.body;
  ExperienceController.addExperience(newExperience, function(err, newExperience) {
    if (err) {
      res.send(err);
    }
    res.json(newExperience);
  })
});

// GET /experiences/:_id
ExperienceRouter.get('/:_id', function(req, res) {
  ExperienceController.getExperienceById(req.params._id, function(err, experience) {
    if (err) {
      res.send(err);
    }
    res.json(experience);
  });
});

// PUT /experiences/:id
ExperienceRouter.put('/:_id', function(req, res) {
  var id = req.params._id;
  var team = req.body;
  ExperienceController.updateExperience(id, experience, {}, function(err, experience) {
    if (err) {
      res.send(err);
    }
    res.json(experience);
  });
});

// DELETE /experiences/:id
ExperienceRouter.delete('/:_id', function(req, res) {
  var id = req.params._id;
  ExperienceController.deleteExperience(id, function(err, experience) {
    if (err) {
      res.send(err);
    }
    res.json(experience);
  });
});

// COMPLETE - prompts server to update a team's completedExperiences
//            once a team completes an experience
// Receives a filename and id's (experience, task, user)
// => Returns a object w/ updated experiences and the next experience
ExperienceRouter.post('/complete/:_id', function(req, res, next) {
  var userId       = req.body.userId,
      taskId       = req.body.taskId,
      fileName     = req.body.filename,
      experienceId = req.params._id;

  ExperienceController.updateOnVideoUpload(userId, fileName, experienceId, taskId, function(err, team) {
    if (err) {
      res.send(err);
    }
    var teamId = team._id;
    ExperienceController.getExperienceById(experienceId, function(err, experience) {
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

          ExperienceController.generateNextExperienceByTeamId(teamId, newCompletedExperience, function(responseObject) {
            res.json(responseObject);
          });
        });
      });
    });
  });
});

module.exports = ExperienceRouter;

