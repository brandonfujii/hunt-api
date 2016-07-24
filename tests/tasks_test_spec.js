require('dotenv').config();
var frisby    = require('frisby'),
    localhost = 'http://localhost:' + process.env.DEV_PORT || 3000,
    tasksUrl = localhost + '/api/tasks';

frisby.create('Get All Tasks')
    .get(tasksUrl)
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes('*', {
      _id: String,
      experienceId: String,
      title: String,
      description: String
    })
    .toss()

frisby.create('Create task')
  .post(tasksUrl + '/create', {
    experienceId: Date.now(),
    title: 'Commit honorable sudoku',
    description: 'Do it'
  })
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .afterJSON(function(res) {
    var taskId = res._id,
        taskIdUrl = tasksUrl + '/' + taskId;

    frisby.create('Get task by ID')
      .get(taskIdUrl)
      .expectStatus(200)
      .expectJSONTypes({
        experienceId: String,
        title: String,
        description: String
      })
      .toss()

    frisby.create('Update task')
      .put(taskIdUrl, {
        title: "Just kidding",
        description: "Don't"
      })
      .expectStatus(200)
      .expectJSONTypes({
        status: true
      })
      .toss()

    frisby.create('Delete task')
      .delete(taskIdUrl)
      .expectStatus(200)
      .expectJSONTypes({
        status: true
      })
      .toss()
  })
  .toss()
