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

      var experienceIds = team.experiences.completed.map(function(experience) {
        return experience.experienceId;
      });

      // only work with locations the current team hasn't gone to
      var filteredExperiences = _.filter(experiences, function(experience) {
        return !_.contains(experienceIds, experience._id);
      });


      filteredExperiences.map(function(experience) {
        var delta = geolib.getDistance(currLocation, experience.location);

        locationDeltas.push({
            experienceId: experience._id,
            location: experience.location,
            delta: delta
          });
      });

      var top_3 = _.chain(locationDeltas)
                    .sortBy(function(location) { return location.delta; })
                    .first(3)
                    .value();
      var selectedExperience = top_3[Math.floor(Math.random() * top_3.length)];


      // find all tasks
      // pick a task that hasn't been completed before by current team

      // changed this to find all tasks
      // TODO change to do the filter in the query 
      TaskModel.Task.find(function(err, tasks) {
        if (err) {
          throw err;
        }

        var taskIds = team.experiences.completed.map(function(task) {
          return task.taskId;
        });

        var filteredTasks = _.filter(tasks, function(task) {
          return !_.contains(taskIds, task._id);
        });

        // need to update task schema so that tasks are not tied to an experience 
        
        if (filteredTasks[0]) {

          // build next experience 
          // & save (replace/update) that to team experiences.next (make sure it's this in the schema)
          // return team.experiences to cb to send back to client

          var nextExperience; // build here

          var response = {
            completed: team.experiences.completed,
            next: nextExperience
          };


          cb(response);
        }
        else {
          console.log("No tasks available for this experience");
          // use other experience?
          //
          // it shouldn't hit this during actual use, we'll need to build in setting a 
          // limit of how many experiences they complete and then not reach here if we already hit that 
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