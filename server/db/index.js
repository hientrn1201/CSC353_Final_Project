const mysql = require('mysql2');
const util = require('util');
var connection  = mysql.createConnection({
  host            : 'localhost',
  user            : 'root',
  password        : 'password',
  database        : 'Food'
});

connection.query = util.promisify(connection.query).bind(connection);

connection.connect(function(err){
  if (err) {
      console.log("error connecting: " + err.stack);
      return;
  };
  console.log("connected as... " + connection.threadId);
});

module.exports = connection;