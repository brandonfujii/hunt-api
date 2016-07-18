var mongoose = require('mongoose'),
    TeamModel = require('../models/team');


module.exports.getTeamByUserId = function(id, cb) {
  return TeamModel.Team.findOne({'users._id': {$in: [id]}}, cb);
}