 var mongoose = require('mongoose'),
     Route    = require('../models/route');

// GET routes
module.exports.getRoutes = function(cb, limit) {
  Route.find(cb).limit(limit);
}

// GET routes by id
module.exports.getRouteById = function(id, cb) {
  Route.findById(id, cb);
}

// POST route
module.exports.addRoute = function(route, cb) {
  Route.create(route, cb);
}

// DELETE route
module.exports.deleteRoute = function(id, cb) {
  var query = { _id: id };
  Route.remove(query, cb);
}

// UPDATE route
module.exports.updateRoute = function(id, changes, cb) {
  Route.findById(id, function(err, route) {
    if (err) {
      res.send(err);
    }
    var flattenedChanges = _lib.flattenObject(changes);
    Route.update(route, { $set: flattenedChanges }, cb);
  });
}
