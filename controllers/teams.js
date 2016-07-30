var mongoose      = require('mongoose'),
    Team          = require('../models/team'),
    _             = require('underscore'),
    geolib        = require('geolib'),
    _lib          = require('../_lib/src'),
    LocationModel = require('../models/location'),
    Task          = require('../models/task'),
    ObjectID      = require('bson-objectid');

// GET /teams
module.exports.getTeams = function(cb, limit) {
  Team.find(cb).limit(limit);
}

// GET /teams/:id
module.exports.getTeamById = function(id, cb) {
  Team.findById(id, cb);
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

// REPLACE/OVERWRITE team by ID
module.exports.replaceTeam = function(id, team, options, cb) {
  var query = { _id: id };
  var updated_team = {
    name: team.name,
    points: team.points,
    users: team.users,
    experiences: team.experiences
  };
  Team.findOneAndUpdate(query, updated_team, options, cb);
}


// UPDATE /teams/:id
module.exports.updateTeam = function(id, changes, cb) {
  Team.findById(id, function(err, team) {
    if (err) {
      res.send(err);
    }
    var flattenedChanges = _lib.flattenObject(changes);
    console.log(flattenedChanges);
    // Team.update(team, { $set: flattenedChanges }, cb);
  });
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

module.exports.generateInitialExperience = function(teamId, currentLocation, cb) {
  this.getTeamById(teamId, function(err, team) {
    if (err) {
      cb({ error: "The team that completed the experience could not be found!"});
    }

    LocationModel.find(function(err, locations) {
      if (err) {
        cb({ error: "Error: No locations found!"})
      }

      if (currentLocation) {
        var locationDeltas = [];

        locations.map(function(location) {
          var userCoordinates = {
            lat: currentLocation.lat,
            lon: currentLocation.lon
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
                      .first(Math.min(3, locationDeltas.length))
                      .value();

        var selectedLocationDelta = selectRandomElement(top_3);
        var selectedLocation = selectedLocationDelta.locationObj;

        Task.find(function(err, tasks) {
          if (err) {
            cb({ error: "Could not fetch tasks" });
          }

          if (tasks) {

            var selectedTask = selectRandomElement(tasks);

            var nextExperience = {
              _id: ObjectID(),
              teamId: team._id,
              task: selectedTask,
              location: selectedLocation,
              order: 1,
              filename: null,
              dateCompleted: null
            };

            cb(null, nextExperience, team);

          } else {
            cb({ error: "No tasks available" });
          }
        });
      } 
    });
  });
}

module.exports.generateNextExperienceByTeamId = function(teamId, currCompletedExperience, cb) {
  this.getTeamById(teamId, function(err, team) {
    if (err) {
      cb({ error: "The team that completed the experience could not be found!"});
    }

    LocationModel.find(function(err, locations) {
      if (err) {
        cb({ error: "Error: No locations found!"});
      }

      if (currCompletedExperience.location) {
        var currLocation = currCompletedExperience.location;

        var locationDeltas = [];
        var completedLocationIds = team.experiences.completed.map(function(experience) {
          return experience.location.locationId;
        });

        // only work with locations the current team hasn't gone to
        // var filteredLocations = _.filter(locations, function(location) {
        //   return !_.contains(completedLocationIds, location._id);
        // });

        // change back to filteredLocations
        locations.map(function(location) {
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
                      .first(Math.min(3, locationDeltas.length))
                      .value();

        var selectedLocationDelta = selectRandomElement(top_3);
        var selectedLocation = selectedLocationDelta.locationObj;

        Task.find(function(err, tasks) {
          if (err) {
            console.log("Could not find task!");
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
              _id: ObjectID(),
              teamId: team._id,
              task: selectedTask,
              location: selectedLocation,
              order: order,
              filename: null,
              dateCompleted: null
            };

            cb(null, nextExperience);

          } else {
            cb({ error: "No tasks available" });
          }

        });
      } else {
        cb({ error: "Could not find team's current location" });
      } 
    });
  });
}
