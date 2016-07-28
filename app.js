// var d = require('domain').create();
// d.on('error', function(err){
//     // this is because there is no '.env'
//     // on PROD, no worries
//     console.log('No environment file?');
// });
// 
// d.run(function(){
//     // Allow for environment variable usage
//     require('dotenv').config();
// });

// Initialize express framework
var express = require('express');
var app = express();

console.log(process.env);

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
var LocationRouter   = require('./routes/locations'),
    HuntRouter       = require('./routes/hunts'),
    UserRouter       = require('./routes/users'),
    TeamRouter       = require('./routes/teams'),
    TaskRouter       = require('./routes/tasks');

// Apply routes
app.use('/api/hunts', HuntRouter);
app.use('/api/users', UserRouter);
app.use('/api/teams', TeamRouter);
app.use('/api/locations', LocationRouter);
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

// Start Server
var port = process.env.DEV_PORT || 1738;
app.listen(port);
console.log('Express is currently running on port ' + port);
