require('dotenv').config();
var frisby    = require('frisby'),
    localhost = 'http://localhost:' + process.env.DEV_PORT || 3000,
    teamsUrl = localhost + '/api/teams';

frisby.create('Get All Teams')
    .get(teamsUrl)
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes('*', {
      _id: String,
      name: String,
      points: Number
    })
    .toss()

frisby.create('Create team')
  .post(teamsUrl + '/create', {
    name: "Team Swift Alpha One",
    points: 12,
    users: [
      {
        _id: Date.now()
      }
    ],
    experiences: {
      completed: [
        {
          experienceId: Date.now() + 1,
          teamId: Date.now() + 2,
          taskTitle: 'Do something',
          clue: {
            title: 'You are getting warmer!',
            description: 'But not too warm.'
          },
          location: {
            lat: 40.734113,
            lon: -73.989132
          }
        }
      ],
      nextExperience: {
        experienceId: Date.now() + 3,
        taskId: Date.now() + 4,
        date: Date.now(),
        filename: String
      }
    }
  })
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .afterJSON(function(res) {
    var teamId = res._id,
        teamIdUrl = teamsUrl + '/' + teamId;

    frisby.create('Get team by ID')
      .get(teamIdUrl)
      .expectStatus(200)
      .expectJSONTypes({
        _id: String,
        name: String,
        points: Number
      })
      .toss()

    frisby.create('Update team')
      .put(teamIdUrl, {
        name: "Team hackNY",
        points: 69
      })
      .expectStatus(200)
      .expectJSONTypes({
        status: true
      })
      .toss()

    frisby.create('Delete team')
      .delete(teamIdUrl)
      .expectStatus(200)
      .expectJSONTypes({
        status: true
      })
      .toss()
  })
  .toss()
