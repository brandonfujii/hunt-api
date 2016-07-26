// require('dotenv').config();
// var frisby    = require('frisby'),
//     localhost = 'http://localhost:' + process.env.DEV_PORT || 3000,
//     experiencesUrl = localhost + '/api/experiences';

// frisby.create('Get All Experiences')
//     .get(experiencesUrl)
//     .expectStatus(200)
//     .expectHeaderContains('content-type', 'application/json')
//     .expectJSONTypes('*', {
//       _id: String,
//       location: {
//         lat: Number,
//         lon: Number,
//         name: String
//       },
//       clue: {
//         title: String,
//         description: String
//       }
//     })
//     .toss()

// frisby.create('Create experience')
//   .post(experiencesUrl + '/create', {
//     location: {
//       lat: -68.23523,
//       lon: 76.12513,
//       name: "Location Name"
//     },
//     clue: {
//       title: 'An experience',
//       description: 'This describes the experience'
//     }
//   })
//   .expectStatus(200)
//   .expectHeaderContains('content-type', 'application/json')
//   .afterJSON(function(res) {
//     var experienceId = res._id,
//         experienceIdUrl = experiencesUrl + '/' + experienceId;

//     frisby.create('Get experience by ID')
//       .get(experienceIdUrl)
//       .expectStatus(200)
//       .expectJSONTypes({
//         _id: String,
//         location: {
//           lat: Number,
//           lon: Number,
//           name: String
//         },
//         clue: {
//           title: String,
//           description: String
//         }
//       })
//       .toss()

//     frisby.create('Update experience')
//       .put(experienceIdUrl, {
//         location: {
//           lat: 75.52532,
//           lon: -76.35235,
//           name: 'New location'
//         },
//         clue: {
//           title: "New Experience",
//           description: "New Description"
//         }
//       })
//       .expectStatus(200)
//       .expectJSONTypes({
//         status: true
//       })
//       .toss()

//     frisby.create('Delete experience')
//       .delete(experienceIdUrl)
//       .expectStatus(200)
//       .expectJSONTypes({
//         status: true
//       })
//       .toss()
//   })
//   .toss()


