var frisby = require('frisby');
var config = require("./config");

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

console.log('Test 3: Create and read job!')
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
    .toss()
  })
.toss();

console.log("Delete not supported as a HTTP method by frisby. A solution could be to add X-HTTP-Method in the header and allow the api to bind this to the specified request.");
