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

// UPDATE /teams/:id > completedExperiences
module.exports.updateCompletedExperiencesById = function(id, newExperience, options, cb) {

  Team.findByIdAndUpdate(id, 
    { $addToSet: { "experiences.completed" : newExperience } 
    }, options, cb);
}
