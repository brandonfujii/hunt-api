var mongoose        = require('mongoose'),
    Experience      = require('../models/experience'),
    TaskModel       = require('../models/task'),
    geolib          = require('geolib'),
    TeamController  = require('./teams'),
    _               = require('underscore'),
    _lib            = require('../_lib/src');


// GET /experiences
module.exports.getExperiences = function(cb, limit) {
  Experience.find(cb).limit(limit);
}

// GET /experiences/:id
module.exports.getExperienceById = function(id, cb) {
  Experience.findById(id, cb);
}

// ADD experience to list of possible experiences
module.exports.addExperience = function(experience, cb) {
  Experience.create(experience, cb);
}

// UPDATE /experiences/:id
module.exports.updateExperience = function(id, changes, cb) {
  Experience.findById(id, function(err, experience) {
    if (err) {
      res.send(err);
    }
    var flattenedChanges = _lib.flattenObject(changes);
    Experience.update(experience, { $set: flattenedChanges }, cb);
  });
}

// DELETE /experiences/:id
module.exports.deleteExperience = function(id, cb) {
  var query = { _id: id };
  Experience.remove(query, cb);
}

module.exports.updateOnVideoUpload = function(userId, fileName, experienceId, taskId, cb) {
  TeamController.getTeamByUserId(userId, cb);
}

module.exports.generateNextExperienceByTeamId = function(teamId, currCompletedExperience, cb) {
  TeamController.getTeamById(teamId, function(err, team) {
    if (err) {
      throw err;
    }

    Experience.find(function(err, experiences) {
      var currLocation = currCompletedExperience.location;
      var locationDeltas = [];
      experiences.map(function(experience) {
        var delta = geolib.getDistance(currLocation, experience.location);

        locationDeltas.push({
            experienceId: experience._id,
            location: experience.location,
            delta: delta
          });
      });

      var top_3 = _.chain(locationDeltas)
                    .sortBy(function(num) { return num; })
                    .first(3)
                    .value();
      var selectedExperience = top_3[Math.floor(Math.random() * top_3.length)];

      TaskModel.Task.find({ experienceId: selectedExperience.experienceId }, function(err, tasks) {
        if (err) {
          throw err;
        }

        var filteredTasks = tasks;  
        team.experiences.completed.map(function(completedExperience) {
          filteredTasks = _.filter(tasks, function(task) {
            return task.experienceId != completedExperience.experienceId;
          });
        });
        
        if (filteredTasks[0]) {
          var response = {
            completed: team.experiences.completed,
            nextExperience: filteredTasks[0]
          }
          cb(response);
        }
        else {
          console.log("No tasks available for this experience");
          // use other experience?
        }

      }); 

    });
    

    // Experience.find(function(experiences) {
    //   experiences.map(function() {

    //   });
    // });


     // get task for a particular experience
          // that they haven't done yet
        // get location (pick one of the three closest)
      
  });
}