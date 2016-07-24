require('dotenv').config();
var frisby    = require('frisby'),
    localhost = 'http://localhost:' + process.env.DEV_PORT || 3000,
    usersUrl = localhost + '/api/users';

frisby.create('Get All Users')
    .get(usersUrl)
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes('*', {
      _id: String,
      name: String,
      teamId: String,
      points: Number
    })
    .toss()

frisby.create('Create user')
  .post(usersUrl + '/create', {
    name: "Alice Ren",
    teamId: Date.now(),
    points: 5
  })
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .afterJSON(function(res) {
    var userId = res._id,
        userIdUrl = usersUrl + '/' + userId;

    frisby.create('Get user by ID')
      .get(userIdUrl)
      .expectStatus(200)
      .expectJSONTypes({
        _id: String,
        name: String,
        teamId: String,
        points: Number
      })
      .toss()

    frisby.create('Update user')
      .put(userIdUrl, {
        name: "Alice Porygon Ren",
        points: 6
      })
      .expectStatus(200)
      .expectJSONTypes({
        status: true
      })
      .toss()

    frisby.create('Delete user')
      .delete(userIdUrl)
      .expectStatus(200)
      .expectJSONTypes({
        status: true
      })
      .toss()
  })
  .toss()
