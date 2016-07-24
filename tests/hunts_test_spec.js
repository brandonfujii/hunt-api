require('dotenv').config();
var frisby    = require('frisby'),
    localhost = 'http://localhost:' + process.env.DEV_PORT || 3000,
    huntsUrl = localhost + '/api/hunts';

frisby.create('Get All Hunts')
    .get(huntsUrl)
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes('*', {
      _id: String,
      startDate: String,
      endDate: String
    })
    .toss()

frisby.create('Create hunt')
  .post(huntsUrl + '/create', {
    startDate: Date.now() - 1,
    endDate: Date.now(),
    teams : [
      {
        _id: Date.now() + 2
      }
    ],
    users: [
      {
        _id: Date.now() + 3
      }
    ],
    tasks: [
      {
        _id: Date.now() + 4
      }
    ]
  })
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .afterJSON(function(res) {
    var huntId = res._id,
        huntIdUrl = huntsUrl + '/' + huntId;

    frisby.create('Get hunt by ID')
      .get(huntIdUrl)
      .expectStatus(200)
      .expectJSONTypes({
        _id: String,
        startDate: String,
        endDate: String,
        teams: [
          {
            _id: String
          }
        ],
        users: [
          {
            _id: String
          }
        ],
        tasks: [
          {
            _id: String
          }
        ]

      })
      .toss()

    frisby.create('Update hunt')
      .put(huntIdUrl, {
        startDate: Date.now(),
        endDate: Date.now() + 6
      })
      .expectStatus(200)
      .expectJSONTypes({
        status: true
      })
      .toss()

    frisby.create('Delete hunt')
      .delete(huntIdUrl)
      .expectStatus(200)
      .expectJSONTypes({
        status: true
      })
      .toss()
  })
  .toss()
