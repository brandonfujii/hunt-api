var frisby = require('frisby');

frisby.create('Get All Tasks')
    .get('http://localhost:1738/api/tasks')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .toss()