var mongoose = require('mongoose'),
    ExperienceModel = require('../models/experience'),
    TaskModel = require('../models/task'),
    geolib = require('geolib'),
    _ = require('underscore');
var TeamController = require('./teams');

// GET /experiences
module.exports.getExperiences = function(cb, limit) {
  ExperienceModel.Experience.find(cb).limit(limit);
}

// GET /experiences/:id
module.exports.getExperienceById = function(id, cb) {
  ExperienceModel.Experience.findById(id, cb);
}

// ADD experience to list of possible experiences
module.exports.addExperience = function(experience, cb) {
  ExperienceModel.Experience.create(experience, cb);
}

// UPDATE /experiences/:id
module.exports.updateExperience = function(id, experience, options, cb) {
  var query = { _id: id };
  var updated_experience = {
    location: experience.location,
    clue: experience.clue
  };
  ExperienceModel.Experience.findOneAndUpdate(query, updated_experience, options, cb);
}

// DELETE /experiences/:id
module.exports.deleteExperience = function(id, cb) {
  var query = { _id: id };
  ExperienceModel.Experience.remove(query, cb);
}

module.exports.updateOnVideoUpload = function(userId, fileName, experienceId, taskId, cb) {
  TeamController.getTeamByUserId(userId, cb);
}

module.exports.generateNextExperienceByTeamId = function(teamId, currCompletedExperience, cb) {
  TeamController.getTeamById(teamId, function(err, team) {
    if (err) {
      throw err;
    }

    ExperienceModel.Experience.find(function(err, experiences) {
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
    

    // ExperienceModel.Experience.find(function(experiences) {
    //   experiences.map(function() {

    //   });
    // });


     // get task for a particular experience
          // that they haven't done yet
        // get location (pick one of the three closest)
      
  });
}