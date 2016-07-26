var mongoose        = require('mongoose'),
    LocationModel   = require('../models/location'),
    TaskModel       = require('../models/task'),
    geolib          = require('geolib'),
    TeamController  = require('./teams'),
    _               = require('underscore'),
    _lib            = require('../_lib/src');


// GET /locations
module.exports.getLocations = function(cb, limit) {
  LocationModel.find(cb).limit(limit);
}

// GET /locations/:id
module.exports.getLocationById = function(id, cb) {
  LocationModel.findById(id, cb);
}

// ADD location to list of possible Locations
module.exports.addLocation = function(location, cb) {
  LocationModel.create(location, cb);
}

// UPDATE /Locations/:id
module.exports.updateLocation = function(id, changes, cb) {
  LocationModel.findById(id, function(err, location) {
    if (err) {
      res.send(err);
    }
    var flattenedChanges = _lib.flattenObject(changes);
    LocationModel.update(location, { $set: flattenedChanges }, cb);
  });
}

// DELETE /Locations/:id
module.exports.deleteLocation = function(id, cb) {
  var query = { _id: id };
  LocationModel.remove(query, cb);
}
