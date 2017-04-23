var frisby = require('frisby');
var config = require("./config");

// This test use frisby. Doc available here: http://frisbyjs.com/docs/api/
// To run, cd in the project root and run $ jasmine-node tests


// test get jobs
console.log('Test 1: Get All Jobs!')
frisby.create('Get All Jobs!')
  .get(config.baseURL+"jobs")
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .toss();

console.log('Test 2: Wrong Api Call!')
//test wrong api call
frisby.create('Wrong Api Call!')
.get(config.baseURL+"wrongApiCall")
.expectStatus(404)
.toss();

//create job , and check it, and delete it

var dataToPost = {
	"Job":{
		"title":"New jbdwe for testing",
		"comment":"comment job",
		"assigned_by_id":2,
		"assigned_to_id":4,
		"patient_id":234,
		"due_date": "2017-03-05 11:25:50"
	}
}

console.log('Test 3: Create, read and delte job!')
frisby.create('Create job!')
.post(config.baseURL+"jobs",dataToPost,{json: true})
.expectHeaderContains('content-type', 'application/json')
.expectStatus(201)
.expectJSONTypes({
   insertId: Number
 })
.afterJSON(function(json) {
    var myId = json.insertId;
    frisby.create('Now get the job!')
      .get(config.baseURL+"jobs/"+myId)
      .expectStatus(200)
      .expectJSON([
          {
            "title": "New jbdwe for testing",
            "status": 0,
            "comment": "comment job",
            "assigned_by_id": 2,
            "assigned_to_id": 4,
            "patient_id": 234,
            "due_date": "2017-03-05T11:25:50.000Z",
          }
      ])
      .afterJSON(function(json) {
          var myId = json[0].job_id;
          frisby.create('Now delete the job!')
            .post(config.baseURL+"jobs/"+myId)
            .addHeader('X-HTTP-Method-Override', 'DELETE')
            .expectStatus(200)
            .expectJSON({ fieldCount: 0,
              affectedRows: 1,
              insertId: 0,
              serverStatus: 2,
              warningCount: 0,
              message: '',
              protocol41: true,
              changedRows: 0 })
          .toss()
        })
    .toss()
  })
.toss();
