var frisby = require('frisby');
var config = require("./config");

frisby.create('Get All Jobs!')
  .get(config.baseURL+"jobs")
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON('0', {
    place: function(val) { expect(val).toMatchOrBeNull("Oklahoma City, OK"); }, // Custom matcher callback
    user: {
      verified: false,
      location: "Oklahoma City, OK",
      url: "http://brightb.it"
    }
  })
  .expectJSONTypes('0', {
    id_str: String,
    retweeted: Boolean,
    in_reply_to_screen_name: function(val) { expect(val).toBeTypeOrNull(String); }, // Custom matcher callback
    user: {
      verified: Boolean,
      location: String,
      url: String
    }
  })
.toss();
