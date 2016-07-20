var frisby = require('frisby');

frisby.create('Get All Experiences')
    .get('http://localhost:1738/api/experiences')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .toss()