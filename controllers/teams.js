var mongoose = require('mongoose'),
    Team     = require('../models/team'),
    _lib     = require('../_lib/src'),
    LocationModel = require('../models/location');

// GET /teams
module.exports.getTeams = function(cb, limit) {
  Team.find(cb).limit(limit);
}

// GET /teams/:id
module.exports.getTeamById = function(id, cb) {
  Team.findById(id, cb);
}

// GET /teams/:userID
module.exports.getTeamByUserId = function(id, cb) {
  return Team.findOne({'users._id': {$in: [id]}}, cb);
}

// POST /teams
module.exports.addTeam = function(team, cb) {
  Team.create(team, cb);
}

// DELETE /teams/:id
module.exports.deleteTeam = function(id, cb) {
  var query = { _id: id };
  Team.remove(query, cb);
}

// UPDATE /teams/:id
module.exports.updateTeam = function(id, changes, cb) {
  Team.findById(id, function(err, team) {
    if (err) {
      res.send(err);
    }
    var flattenedChanges = _lib.flattenObject(changes);
    Team.update(team, { $set: flattenedChanges }, cb);
  });
}

module.exports.updateOnVideoUpload = function(userId, fileName, LocationId, taskId, cb) {
  TeamController.getTeamByUserId(userId, cb);
}


// UPDATE /teams/:id > completedExperiences
module.exports.updateCompletedExperiencesById = function(id, newExperience, options, cb) {

  Team.findByIdAndUpdate(id, 
    { $addToSet: { "experiences.completed" : newExperience } 
    }, options, cb);
}

var selectRandomElement = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports.generateNextExperienceByTeamId = function(teamId, currCompletedExperience, cb) {
  TeamController.getTeamById(teamId, function(err, team) {
    if (err) {
      throw err;
    }

    LocationModel.find(function(err, locations) {
      var currLocation = currCompletedExperience.location;
      var locationDeltas = [];

      var completedLocationIds = team.experiences.completed.map(function(experience) {
        return experience.location.locationId;
      });

      // only work with locations the current team hasn't gone to
      var filteredLocations = _.filter(locations, function(location) {
        return !_.contains(completedLocationIds, location._id);
      });


      filteredLocations.map(function(location) {
        var userCoordinates = {
          lat: currLocation.lat,
          lon: currLocation.lon
        };

        var locationCoordinates = {
          lat: location.lat,
          lon: location.lon
        };

        var delta = geolib.getDistance(userCoordinates, locationCoordinates);
        locationDeltas.push({
            locationObj: location,
            delta: delta
          });
      });

      var top_3 = _.chain(locationDeltas)
                    .sortBy(function(locationDelta) { return locationDelta.delta; })
                    .first(3)
                    .value();

      var selectedLocationDelta = selectRandomElement(top_3);
      var selectedLocation = selectedLocationDelta.locationObj;

      // find all tasks
      // pick a task that hasn't been completed before by current team

      // changed this to find all tasks
      // TODO change to do the filter in the query 
      TaskModel.Task.find(function(err, tasks) {
        if (err) {
          throw err;
        }

        var completedTaskIds = team.experiences.completed.map(function(experience) {
          return experience.task.taskId;
        });

        var filteredTasks = _.filter(tasks, function(task) {
          return !_.contains(completedTaskIds, task._id);
        });

        if (filteredTasks[0]) {

          var selectedTask = selectRandomElement(filteredTasks);

          // build next Location 
          // & save (replace/update) that to team Locations.next (make sure it's this in the schema)
          // return team.Locations to cb to send back to client

          // need to figure out order 
          var order = team.experiences.completed.length + 1;

          var nextExperience = {
            teamId: team._id,
            task: selectedTask,
            location: selectedLocation,
            order: order,
            filename: null,
            dateCompleted: null
          };

          // should we update the whole team object or just the team.Locations.next object  
          var locationChanges = {
            experiences: {
              next: nextExperience
            }
          }
          updateTeam(teamId, locationChanges, function(err) {
            if (err) {
              cb({ err: "Cannot update team!" });
            }


          })

        }
        else {
          cb({err: "No tasks available"});
          // use other Location?
          //
          // it shouldn't hit this during actual use, we'll need to build in setting a 
          // limit of how many Locations they complete and then not reach here if we already hit that 
        }

      }); 
    });
  });
}
