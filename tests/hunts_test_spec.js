var frisby = require('frisby');

frisby.create('Get All Hunts')
    .get('http://localhost:1738/api/hunts')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .toss()