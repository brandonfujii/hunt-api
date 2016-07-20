var frisby = require('frisby');

frisby.create('Get All Teams')
    .get('http://localhost:1738/api/teams')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .toss()