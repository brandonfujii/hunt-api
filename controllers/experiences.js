var mongoose = require('mongoose'),
    ExperienceModel = require('../models/experience');

var TeamController = require('./teams');


module.exports.updateOnVideoUpload = function(userId, fileName, experienceId, cb) {
  TeamController.getTeamByUserId(userId, cb);
}

module.exports.getExperienceById = function(id, cb) {
  ExperienceModel.Experience.findById(id, cb);
}

module.exports.getNextExperience = function(cb) {
  
}