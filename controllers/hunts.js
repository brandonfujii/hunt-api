var mongoose = require('mongoose'),
    HuntModel = require('../models/hunt');

module.exports.getHuntTasks = function() {
  return HuntModel.Hunt.find('tasks');
}