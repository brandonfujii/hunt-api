// Allow for environment variable usage
require('dotenv').config();

// Initialize express framework
var express = require('express');
var app = express();

// Reveal those beautiful requests and errors
var logger = require('morgan');
app.use(logger('dev'));

// Use JSON format for data
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;

// Define controller routers
var GameRouter = express.Router(),
    UserRouter = express.Router(),
    TeamRouter = express.Router(),
    CheckpointRouter = express.Router();

// Define home route
app.get('/', function(req, res, next) {
  res.sendFile('index.html', {root: __dirname });
});

// Define controller routes
app.use('/api/games', GameRouter);
app.use('/api/users', UserRouter);
app.use('/api/teams', TeamRouter);
app.use('/api/checkpoints', CheckpointRouter);

var Controllers = require('./controllers/init');

// Enable Cross Origin Resource Sharing (CORS)
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
      res.status(200).end();
  } else {
      next();
  }
});

/* USER ROUTES */
// GET /users
UserRouter.get('/', function(req, res, next) {
  Controllers.User.getUsers(function(err, user) {
    if (err) {
      throw err;
    }
    res.json(user)
  })
});

// POST /users
UserRouter.post('/', function(req, res) {
  var newUser = req.body;
  Controllers.User.addUser(newUser, function(err, newUser) {
    if (err) {
      throw err;
    }
    res.json(newUser);
  })
});

// GET /users/:_id
UserRouter.get('/:_id', function(req, res) {
  Controllers.User.getUserById(req.params._id, function(err, user) {
    if (err) {
      throw err;
    }
    res.json(user);
  });
});

// PUT /users/:id
UserRouter.put('/:_id', function(req, res) {
  var id = req.params._id;
  var user = req.body;
  Controllers.User.updateUser(id, user, {}, function(err, user) {
    if (err) {
      throw err;
    }
    res.json(user);
  });
});

// DELETE /users/:id
UserRouter.delete('/:_id', function(req, res) {
  var id = req.params._id;
  Controllers.User.deleteUser(id, function(err, user) {
    if (err) {
      throw err;
    }
    res.json(user);
  });
});

/* TEAM ROUTES */
TeamRouter.get('/', function(req, res, next) {
  res.send('Teams and shit!');
});

CheckpointRouter.get('/', function(req, res, next) {
  res.send('Checkpoints and shit!');
});

/* Sample checkpoint */
app.get('/sample', function(req, res, next) {
  res.json(
    [
      {
        location: {
          lat: 40.733855, 
          lon: -73.989643
        },
        clue: {
          description: "Think Fast. It will all add up."
        },
        title: '4th Street',
        description: "it's just a street"
      },
      {
        location: {
          lat: 40.733643, 
          lon: -73.987862
        },
        clue: {
          description: "Hey, go fuck yourself"
        },
        title: 'NYU Palladium',
        description: 'Pally is pretty cool itself'
      }
    ]
  );
});

// app.get('/video/url', function(req, res) {
//   const filename = 'saveForSlicing.mp4';

//   res.send({
//     team: 'someTeamId',
//     filename: filename
//   });
  
// });

app.get('/video/:filename', function(req, res) {
  res.sendFile('/videos/' + req.params.filename, {root: __dirname});
});

// Start Server
var port = process.env.PORT || 1738;
app.listen(port);
console.log('Express is currently running on port ' + port);