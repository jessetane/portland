/*
 *  service2.js
 *
 */


var env = process.env;
env.PORT = env.PORT || 8081;

var net = require("net");
var connection = null;
var server = net.createServer(function (client) {
  console.log("connected");
  connection = client;
  connection.on("data", function (data) {
    connection.write(data.toString().toUpperCase());
  });
  connection.on("error", end);
  connection.on("end", end);
  function end () {
    console.log("disconnected");
    connection = null;
  }
  connection.write("connected!");
});
server.listen(env.PORT);
console.log("service2 listening on " + env.PORT);
