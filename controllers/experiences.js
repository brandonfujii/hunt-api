var mongoose = require('mongoose'),
    ExperienceModel = require('../models/experience');

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

module.exports.generateNextExperienceByTeamId = function(teamId) {
  TeamController.getTeamById(teamId, function(err, team) {
    if (err) {
      throw err;
    }

    console.log(team.experiences.completed);

    // ExperienceModel.Experience.find(function(experiences) {
    //   experiences.map(function() {

    //   });
    // });


     // get task for a particular experience
          // that they haven't done yet
        // get location (pick one of the three closest)
      
  });
}