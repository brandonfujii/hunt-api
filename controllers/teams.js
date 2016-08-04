var mongoose      = require('mongoose'),
    Team          = require('../models/team'),
    _             = require('underscore'),
    geolib        = require('geolib'),
    _lib          = require('../_lib/src'),
    LocationModel = require('../models/location'),
    Route         = require('../models/route'),
    Task          = require('../models/task'),
    ObjectID      = require('bson-objectid');

var FINAL_TASK = {
    "task": {   
                "title": "Hunt Completed",
                "description": "This should never show up.",
                "points": 10,
                "locationId": []
    },
    "location": {   
                "name": "Hunt Complete",
                "lon": -1.5,
                "lat": 1.5,
                "clueDescription": "Congratulations! You have completed all possible tasks & explored all locations.",
                "radius": 0.00001
    },
    "filename": null,
    "order": 0,
    "dateCompleted": null
};

// GET /teams
module.exports.getTeams = function(cb, limit) {
  Team.find(cb).limit(limit).sort({ 'points' : -1 });
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

module.exports.generateNextExperienceInRouteByTeamId = function(teamId, currCompletedExperience, cb) {
  this.getTeamById(teamId, function(err, team) {
    if (err) {
      cb({ error: "The team that completed the experience could not be found!"});
    }

    Route.find({ teamId : teamId }, function(err, routes) {
      if (err) {
        cb({ error: "Cannot pair team with route"});
      }

      if (routes[0]) {
        if (currCompletedExperience.location) {
          var completedExperiences = team.experiences.completed.concat();
          completedExperiences.push(currCompletedExperience);
          var completedLocationIds = completedExperiences.map(function(experience) {
            return experience.location._id;
          });

          var routeLocations = routes[0].locations;
          var filteredLocations = _.filter(routeLocations, function(routeLocation) {
            return !_.contains(completedLocationIds, routeLocation._id);
          });
          var sortedLocations = _.sortBy(filteredLocations, function(location) {
            return -location.order;
          });

          var nextLocation = sortedLocations.pop();
          console.log(nextLocation);

          Task.find(function(err, tasks) {
            if (err) {
              cb({ error: "Could not get tasks"});
            }

            if (tasks.length) {
              var nextExperience = {
                _id: ObjectID(),
                teamId: teamId,
                task: tasks[0],
                location: nextLocation,
                order: nextLocation.order,
                filename: null,
                dateCompleted: null
              };

              cb(null, nextExperience);
            } else {
              cb(null, FINAL_TASK);
            }
          });
        } else {
          cb({ error: "Team's completed experience location does not exist" });
        }
      } else {
        cb({ error: "Found no routes for this particular team"});
      }

    });

  });
};


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

        var completedExperiences = team.experiences.completed.concat();
        completedExperiences.push(currCompletedExperience);
        var completedLocationIds = completedExperiences.map(function(experience) {
          return experience.location._id;
        });

        // only work with locations the current team hasn't gone to
        var filteredLocations = _.filter(locations, function(location) {
          return !_.contains(completedLocationIds, location._id.toString());
        });

        // change back to filteredLocations
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
                      .first(Math.min(3, locationDeltas.length))
                      .value();

        if(_.isEmpty(top_3)) {
            console.log("NO MORE TASKS");
            cb(null, FINAL_TASK);
            return;
        }

        Task.find(function(err, tasks) {
          if (err) {
            console.log("Could not find task!");
            throw err;
          }

          var completedTaskIds = team.experiences.completed.map(function(experience) {
            return experience.task._id;
          });

          var filteredTasks = _.filter(tasks, function(task) {
            return !_.contains(completedTaskIds, task._id.toString());
          });

          if (filteredTasks[0]) {
            var selectedLocation = null;
            var selectedTask = null;

            // select a task specific to one of the top locations, if possible
            var locationSpecificTasks = _.filter(filteredTasks, function(task) {
                var isGood = false;
                top_3.forEach(function(location) {
                    if(_.contains(task.locationId, location.locationObj._id.toString())) {
                        isGood =  true;
                    }
                });
                return isGood;
            });

            if(!_.isEmpty(locationSpecificTasks)) {
                selectedTask = selectRandomElement(locationSpecificTasks);
                selectedLocation = _.find(top_3, function(location) {
                    return _.contains(selectedTask.locationId, location.locationObj._id.toString());
                }).locationObj;
            }
            else {
                var generalTasks = _.filter(filteredTasks, function(task) {
                    return _.isEmpty(task.locationId); 
                });
                selectedTask = selectRandomElement(generalTasks);
                selectedLocation = selectRandomElement(top_3).locationObj;
            }

            var order = team.experiences.next.order + 1;

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
            cb(null, FINAL_TASK);
          }

        });
      } else {
        cb({ error: "Could not find team's current location" });
      } 
    });
  });
}
