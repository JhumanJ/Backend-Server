//------------- MySQL + API ---------------

// Mysql setup + connection

var connect = function() {
  var mysql = require('mysql');
  var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'peach'
  });
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error('Error connecting to DB: ' + err.stack);
      return;
    }
    // console.log('Connected to Peach MySQL DB via a pool!');
  });
  return pool;
}

var pool = connect();
module.exports = pool;
