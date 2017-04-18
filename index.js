const express = require("express");
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));

require('./api/routes')(app);

app.listen(8080, function () {
  console.log('API listening on port 8080!');
});
