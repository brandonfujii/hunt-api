var mongoose = require('mongoose'),
    TeamModel = require('../models/team');

// GET /teams
module.exports.getTeams = function(cb, limit) {
  TeamModel.Team.find(cb).limit(limit);
}

// GET /teams/:id
module.exports.getTeamById = function(id, cb) {
  TeamModel.Team.findById(id, cb);
}

// GET /teams/:userID
module.exports.getTeamByUserId = function(id, cb) {
  return TeamModel.Team.findOne({'users._id': {$in: [id]}}, cb);
}

// POST /teams
module.exports.addTeam = function(team, cb) {
  TeamModel.Team.create(team, cb);
}

// DELETE /teams/:id
module.exports.deleteTeam = function(id, cb) {
  var query = { _id: id };
  TeamModel.Team.remove(query, cb);
}

// UPDATE /teams/:id
module.exports.updateTeam = function(id, team, options, cb) {
  var query = { _id: id };
  var updated_team = {
    name: team.name,
    points: team.points,
    users: team.users,
    completedExperiences: team.completedExperiences
  };
  TeamModel.Team.findOneAndUpdate(query, updated_team, options, cb);
}

// UPDATE /teams/:id > completedExperiences
module.exports.updateCompletedExperiencesById = function(id, newExperience, options, cb) {

  TeamModel.Team.findByIdAndUpdate(id, 
    { $addToSet: { "experiences.completed" : newExperience } 
    }, options, cb);
}

// // TODO: change findbyID to findOneAndUpdate
// module.exports.addNewExperience = function(id, newExperience) {
//   TeamModel.Team.findById(id, function(team) {
//     team.completedExperiences = team.completedExperiences.concat([newExperience]);
//   }); 
// }

