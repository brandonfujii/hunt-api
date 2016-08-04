var express          = require('express'),
    RouteRouter      = express.Router(),
    Route            = require('../models/route'),
    RouteController  = require('../controllers/routes');

// GET /routes
RouteRouter.get('/', function(req, res, next) {
  RouteController.getRoutes(function(err, routes) {
    if (err) {
      res.send(err);
    }
    res.json(routes);
  })
});

// POST /routes/create
RouteRouter.post('/create', function(req, res) {
  var newRoute = req.body;
  RouteController.addRoute(newRoute, function(err, newRoute) {
    if (err) {
      res.send(err);
    }
    res.json(newRoute);
  })
});

// GET /routes/:_id
RouteRouter.get('/:_id', function(req, res) {
  RouteController.getRouteById(req.params._id, function(err, route) {
    if (err) {
      res.send(err);
    }
    res.json(route);
  });
});

// PUT /routes/:id
RouteRouter.put('/:_id', function(req, res) {
  var id = req.params._id;
  var changes = req.body;

  RouteController.updateRoute(id, changes, function(err) {
    if (err) {
      res.send(err);
    }
    res.json({ status: true });
  });
});

// DELETE /routes/:id
RouteRouter.delete('/:_id', function(req, res) {
  var id = req.params._id;
  RouteController.deleteRoute(id, function(err, route) {
    if (err) {
      res.send(err);
    }
    res.json({ status: true });
  });
});

module.exports = RouteRouter;

