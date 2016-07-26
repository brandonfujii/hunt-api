var express              = require('express'),
    LocationRouter       = express.Router(),
    LocationController   = require('../controllers/locations'),
    TaskController       = require('../controllers/tasks'),
    TeamController       = require('../controllers/teams'),
    firebaseApp          = require('../utils/firebase'); 

// GET /locations
LocationRouter.get('/', function(req, res, next) {
  LocationController.getLocations(function(err, locations) {
    if (err) {
      res.send(err);
    }

    res.json(locations);
  });
});

// POST /locations/create
LocationRouter.post('/create', function(req, res) {
  var newExperience = req.body;
  LocationController.addLocation(newLocation, function(err, newLocation) {
    if (err) {
      res.send(err);
    }
    res.json(newExperience);
  })
});

// GET /locations/:_id
LocationRouter.get('/:_id', function(req, res) {
  LocationController.getLocationById(req.params._id, function(err, location) {
    if (err) {
      res.send(err);
    }
    res.json(location);
  });
});

// PUT /experiences/:id
LocationRouter.put('/:_id', function(req, res) {
  var id = req.params._id;
  var changes = req.body;

  LocationController.updateLocation(id, changes, function(err, location) {
    if (err) {
      res.send(err);
    }
    res.json(location);
  });
});

// DELETE /experiences/:id
LocationRouter.delete('/:_id', function(req, res) {
  var id = req.params._id;
  LocationController.deleteLocation(id, function(err, location) {
    if (err) {
      res.send(err);
    }
    res.json({ status : true });
  });
});

module.exports = LocationRouter;
