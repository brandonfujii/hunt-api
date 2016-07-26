var mongoose = require('mongoose'),
    Team     = require('../models/team'),
    _lib     = require('../_lib/src');

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

module.exports.generateNextLocationByTeamId = function(teamId, currCompletedLocation, cb) {
  TeamController.getTeamById(teamId, function(err, team) {
    if (err) {
      throw err;
    }

    Location.find(function(err, locations) {
      var currLocation = currCompletedLocation.location;
      var locationDeltas = [];

      var LocationIds = team.Locations.completed.map(function(Location) {
        return Location.LocationId;
      });

      // only work with locations the current team hasn't gone to
      var filteredLocations = _.filter(Locations, function(Location) {
        return !_.contains(LocationIds, Location._id);
      });


      filteredLocations.map(function(Location) {
        var delta = geolib.getDistance(currLocation, Location.location);

        locationDeltas.push({
            LocationId: Location._id,
            location: Location.location,
            delta: delta
          });
      });

      var top_3 = _.chain(locationDeltas)
                    .sortBy(function(location) { return location.delta; })
                    .first(3)
                    .value();
      var selectedLocation = top_3[Math.floor(Math.random() * top_3.length)];


      // find all tasks
      // pick a task that hasn't been completed before by current team

      // changed this to find all tasks
      // TODO change to do the filter in the query 
      TaskModel.Task.find(function(err, tasks) {
        if (err) {
          throw err;
        }

        var taskIds = team.Locations.completed.map(function(task) {
          return task.taskId;
        });

        var filteredTasks = _.filter(tasks, function(task) {
          return !_.contains(taskIds, task._id);
        });

        // need to update task schema so that tasks are not tied to an Location 
        
        if (filteredTasks[0]) {

          var nextTask = filteredTasks[0];

          // build next Location 
          // & save (replace/update) that to team Locations.next (make sure it's this in the schema)
          // return team.Locations to cb to send back to client

          // need to figure out order 
          var nextCount = team.Locations.completed.length + 1;

          var nextLocation = {
            LocationId: selectedLocation._id,
            teamId: team._id,
            task: filteredTasks[0],
            clue: selectedLocation.clue,
            location: selectedLocation.location,
            order: nextCount,
            filename: null,
            dateCompleted: null
          };

          // should we update the whole team object or just the team.Locations.next object  
          Team.findOneAndUpdate({'_id': team._id}, {'Locations.next': nextLocation}, {upsert: true}, function(err, doc){

            console.log(doc);

            // see if this is returning the full Locations doc with completed and next 

            cb(doc.Locations);
          });

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
    

    // Location.find(function(Locations) {
    //   Locations.map(function() {

    //   });
    // });


     // get task for a particular Location
          // that they haven't done yet
        // get location (pick one of the three closest)
      
  });
}
