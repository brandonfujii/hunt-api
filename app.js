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

var firebaseApp = require('./utils/firebase');

// Define controller routers
var HuntRouter = express.Router(),
    UserRouter = express.Router(),
    TeamRouter = express.Router(),
    TaskRouter = express.Router(),
    ExperienceRouter = express.Router();

// Define home route
app.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: __dirname });
});

// Define controller routes
app.use('/api/hunts', HuntRouter);
app.use('/api/users', UserRouter);
app.use('/api/teams', TeamRouter);
app.use('/api/experiences', ExperienceRouter);
app.use('/api/tasks', TaskRouter);

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

/* 
 * User Endpoints
*/
// GET /users
UserRouter.get('/', function(req, res, next) {
  Controllers.User.getUsers(function(err, users) {
    if (err) {
      throw err;
    }
    res.json(users);
  })
});

// POST /users/create
UserRouter.post('/create', function(req, res) {
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

// DELETE /teams/:id
UserRouter.delete('/:_id', function(req, res) {
  var id = req.params._id;
  Controllers.User.deleteUser(id, function(err, user) {
    if (err) {
      throw err;
    }
    res.json(user);
  });
});

/*
 * Team Endpoints
*/
// GET /teams
TeamRouter.get('/', function(req, res, next) {
  Controllers.Team.getTeams(function(err, teams) {
    if (err) {
      throw err;
    }
    res.json(teams);
  })
});

// POST /teams/create
TeamRouter.post('/create', function(req, res) {
  var newTeam = req.body;
  Controllers.Team.addTeam(newTeam, function(err, newTeam) {
    if (err) {
      throw err;
    }
    res.json(newTeam);
  })
});

// GET /teams/:_id
TeamRouter.get('/:_id', function(req, res) {
  Controllers.Team.getTeamById(req.params._id, function(err, team) {
    if (err) {
      throw err;
    }
    res.json(team);
  });
});

// PUT /teams/:id
TeamRouter.put('/:_id', function(req, res) {
  var id = req.params._id;
  var team = req.body;
  Controllers.Team.updateTeam(id, team, {}, function(err, team) {
    if (err) {
      throw err;
    }
    res.json(team);
  });
});

// DELETE /teams/:id
TeamRouter.delete('/:_id', function(req, res) {
  var id = req.params._id;
  Controllers.User.deleteTeam(id, function(err, team) {
    if (err) {
      throw err;
    }
    res.json(team);
  });
});


/* 
* Hunt endpoints 
*/

// GET /hunts
HuntRouter.get('/', function(req, res, next) {
  Controllers.Hunt.getHunts(function(err, hunts) {
    if (err) {
      throw err;
    }
    res.json(hunts);
  });
});

// POST /hunts/create
HuntRouter.post('/create', function(req, res) {
  var newHunt = req.body;
  Controllers.Hunt.addHunt(newHunt, function(err, newHunt) {
    if (err) {
      throw err;
    }
    res.json(newHunt);
  })
});

// GET /hunts/:id
HuntRouter.get('/:_id', function(req, res, next) {
  Controllers.Hunt.getHuntById(req.params._id, function(err, hunt) {
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
  Controllers.Hunt.updateHunt(id, hunt, {}, function(err, hunt) {
    if (err) {
      throw err;
    }
    res.json(hunt);
  });
});

// DELETE /hunts/:id
HuntRouter.delete('/:_id', function(req, res) {
  var id = req.params._id;
  Controllers.Hunt.deleteHunt(id, function(err, hunt) {
    if (err) {
      throw err;
    }
    res.json(hunt);
  });
});


/* 
* Task endpoints
*/

// GET /tasks
TaskRouter.get('/', function(req, res, next) {
  Controllers.Task.getTasks(function(err, tasks) {
    if (err) {
      throw err;
    }
    res.json(tasks);
  });
});

// POST /teams/create
TaskRouter.post('/create', function(req, res) {
  var newTask = req.body;
  Controllers.Task.addTask(newTask, function(err, newTask) {
    if (err) {
      throw err;
    }
    res.json(newTask);
  })
});

// GET /tasks/:id
TaskRouter.get('/:_id', function(req, res, next) {
  Controllers.Task.getTaskById(req.params._id, function(err, task) {
    if (err) {
      throw err;
    }
    res.json(task);
  });
});

// PUT /tasks/:id
TaskRouter.put('/:_id', function(req, res) {
  var id = req.params._id;
  var task = req.body;
  Controllers.Task.updateTask(id, task, {}, function(err, task) {
    if (err) {
      throw err;
    }
    res.json(task);
  });
});

// DELETE /tasks/:id
TaskRouter.delete('/:_id', function(req, res) {
  var id = req.params._id;
  Controllers.Task.deleteTask(id, function(err, task) {
    if (err) {
      throw err;
    }
    res.json(task);
  });
});


/* 
* Experience endpoints
*/

// GET /experiences
ExperienceRouter.get('/', function(req, res, next) {
  Controllers.Experience.getExperiences(function(err, experiences) {
    if (err) {
      throw err;
    }

    res.json(experiences);
  });
});

// POST /experiences/create
ExperienceRouter.post('/create', function(req, res) {
  var newExperience = req.body;
  Controllers.Experience.addExperience(newExperience, function(err, newExperience) {
    if (err) {
      throw err;
    }
    res.json(newExperience);
  })
});

// GET /experiences/:_id
ExperienceRouter.get('/:_id', function(req, res) {
  Controllers.Experience.getExperienceById(req.params._id, function(err, experience) {
    if (err) {
      throw err;
    }
    res.json(experience);
  });
});

// PUT /experiences/:id
ExperienceRouter.put('/:_id', function(req, res) {
  var id = req.params._id;
  var team = req.body;
  Controllers.Experience.updateExperience(id, experience, {}, function(err, experience) {
    if (err) {
      throw err;
    }
    res.json(experience);
  });
});

// DELETE /experiences/:id
ExperienceRouter.delete('/:_id', function(req, res) {
  var id = req.params._id;
  Controllers.Experience.deleteExperience(id, function(err, experience) {
    if (err) {
      throw err;
    }
    res.json(experience);
  });
});

// COMPLETE - prompts server to update a team's completedExperiences
//            once a team completes an experience
// Receives a filename and id's (experience, task, user)
// => Returns a object w/ updated experiences and the next experience
ExperienceRouter.post('/complete/:_id', function(req, res, next) {
  var userId = req.body.userId,
      taskId = req.body.taskId,
      fileName = req.body.filename,
      experienceId = req.params._id;

  Controllers.Experience.updateOnVideoUpload(userId, fileName, experienceId, taskId, function(err, team) {
    var teamId = team._id;
    Controllers.Experience.getExperienceById(experienceId, function(err, experience) {
      var location = experience.location,
          clue = experience.clue;

      Controllers.Task.getTaskById(taskId, function(err, task) {
        var taskTitle = task.title;
        var newCompletedExperience = {
            experienceId: experienceId,
            teamId: teamId,
            filename: fileName,
            taskTitle: taskTitle,
            clue: clue,
            location: location
        };

        // Update the team object's completedExperiences (byTeamId)
        Controllers.Team.updateCompletedExperiencesById(teamId, newCompletedExperience, {}, function(err, experience) {
          if (err) {
            throw err;
          }

          Controllers.Experience.generateNextExperienceByTeamId(teamId, newCompletedExperience, function(responseObject) {
            res.json(responseObject);
          });
        });
      });
    });
  });
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
