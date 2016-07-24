var d = require('domain').create();
d.on('error', function(err){
    // this is because there is no '.env'
    // on PROD, no worries
});
d.run(function(){
    // Allow for environment variable usage
    require('dotenv').config();
});

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

var firebaseApp = require('./utils/firebase');

// Define routes
var ExperienceRouter = require('./routes/experiences'),
    HuntRouter       = require('./routes/hunts'),
    UserRouter       = require('./routes/users'),
    TeamRouter       = require('./routes/teams'),
    TaskRouter       = require('./routes/tasks');

// Apply routes
app.use('/api/hunts', HuntRouter);
app.use('/api/users', UserRouter);
app.use('/api/teams', TeamRouter);
app.use('/api/experiences', ExperienceRouter);
app.use('/api/tasks', TaskRouter);

// Define home route
app.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: __dirname });
});

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

/* Sample task */
app.get('/sample', function(req, res, next) {
  res.json(
    [
      {
        location: {
          lat: 40.733855, 
          lon: -73.989643,
          name: "Location name"
        },
        clue: {
          title: "HackMIT",
          description: "Think Fast. It will all add up."
        },
        task: {
          title: "Some Task Title 1",
          description: "Some Task Description"
        }
      },
      {
        location: {
          lat: 40.733643, 
          lon: -73.987862,
          name: "Location name 2: Electric Boogaloo"
        },
        clue: {
          title: "NYU Palladium Hall",
          description: "Find something to do here."
        },
        task: {
          title: "Some Task Title 2: Electric Boogaloo",
          description: "Some Task Description"
        }
      }
    ]
  );
});

app.get('/video/url', function(req, res) {
  const filename = 'saveForSlicing.mp4';

  res.send({
    team: 'someTeamId',
    filename: filename
  });

});

app.get('/video/:filename', function(req, res) {
  res.sendFile('/videos/' + req.params.filename, {root: __dirname});
});

// Start Server
var port = process.env.PORT || 1738;
app.listen(port);
console.log('Express is currently running on port ' + port);
