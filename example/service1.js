/*
 *  service1.js
 *
 */


var env = process.env;
env.PORT = env.PORT || 8080;
env.PEER_PORT = env.PEER_PORT || 8081;

var net = require("net");
var http = require("http");
var express = require("express");

var connection = null;
var server = express();
server.use(express.logger("tiny"));
server.use(express.errorHandler());

server.get("/connect", function (req, res, next) {
  connection = net.connect({ port: env.PEER_PORT }, function () {
    console.log("connected");
  });
  connection.once("data", function (data) {
    res.end(data);
  });
  connection.on("error", end);
  connection.on("end", end);
  function end () {
    console.log("disconnected");
    connection = null;
  }
});

server.get("/", function (req, res, next) {
  var message = req.query.message;
  if (connection && message) {
    connection.once("data", function (data) {
      res.end(data);
    });
    connection.write(message);
  } else {
    res.end("Not connected");
  }
});

server.listen(env.PORT);
console.log("service1 listening on " + env.PORT);
