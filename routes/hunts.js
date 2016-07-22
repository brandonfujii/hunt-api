var express        = require('express'),
    HuntRouter     = express.Router(),
    HuntController = require('../controllers/hunts');

// GET /hunts
HuntRouter.get('/', function(req, res, next) {
  HuntController.getHunts(function(err, hunts) {
    if (err) {
      res.send(err);
    }
    res.json(hunts);
  });
});

// POST /hunts/create
HuntRouter.post('/create', function(req, res) {
  var newHunt = req.body;
  HuntController.addHunt(newHunt, function(err, newHunt) {
    if (err) {
      res.send(err);
    }
    res.json(newHunt);
  })
});

// GET /hunts/:id
HuntRouter.get('/:_id', function(req, res, next) {
  HuntController.getHuntById(req.params._id, function(err, hunt) {
    if (err) {
      throw err;
    }
    res.json(hunt);
  });
});

// PUT /hunts/:id
HuntRouter.put('/:_id', function(req, res) {
  var id = req.params._id;
  var hunt = req.body;
  HuntController.updateHunt(id, hunt, {}, function(err, hunt) {
    if (err) {
      res.send(err);
    }
    res.json(hunt);
  });
});

// DELETE /hunts/:id
HuntRouter.delete('/:_id', function(req, res) {
  var id = req.params._id;
  HuntController.deleteHunt(id, function(err, hunt) {
    if (err) {
      res.send(err);
    }
    res.json(hunt);
  });
});

module.exports = HuntRouter;
