var frisby = require('frisby');

frisby.create('Get All Users')
    .get('http://localhost:1738/api/users')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes('*', {
      name: String,
      teamId: String, 
      points: Number
    })
    .toss()