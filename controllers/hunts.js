var mongoose  = require('mongoose'),
    Hunt      = require('../models/hunt'),
    _lib      = require('../_lib/src');

// GET /hunts
module.exports.getHunts = function(cb, limit) {
  Hunt.find(cb).limit(limit);
}

// GET /hunts/:id
module.exports.getHuntById = function(id, cb) {
  Hunt.findById(id, cb);
}

// POST /hunts
module.exports.addHunt = function(hunt, cb) {
  Hunt.create(hunt, cb);
}

// DELETE /hunts/:id
module.exports.deleteHunt = function(id, cb) {
  var query = { _id: id };
  Hunt.remove(query, cb);
}

// UPDATE /hunts/:id
module.exports.updateHunt = function(id, changes, cb) {
  Hunt.findById(id, function(err, hunt) {
    if (err) {
      res.send(err);
    }
    var flattenedChanges = _lib.flattenObject(changes);
    Hunt.update(hunt, { $set: flattenedChanges }, cb);
  });
}
