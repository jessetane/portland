/*
 *  server.js
 *
 */


var fs = require("fs");
var express = require("express");
var semver = require("semver");
var registry = require("./registry");

exports.listen = function (port) {
  server.listen(port);
  return registry;
}

var server = express();
server.use(express.bodyParser());
server.use(express.logger("tiny"));
server.use(server.router);
server.use(function (err, req, res, next) {
  console.error("server error", err.stack);
  res.send(500, "server error");
});

server.post("/register", function (req, res, next) {
  var port = registry.register(req.body.service);
  if (port) {
    res.end(port);
  } else {
    res.writeHead(400);
    res.end("Please specify a service to register");
  }
});

server.post("/free", function (req, res, next) {
  var service = req.body.service;
  var freed = registry.free(service);
  if (freed) {
    res.end();
  } else if (freed === false) {
    res.writeHead(404);
    res.end("Service '" + service + "' not found");
  } else {
    res.writeHead(400);
    res.end("Please specify a service to free");
  }
});

server.post("/promote", function (req, res, next) {
  var service = req.body.service;
  var promoted = registry.promote(service);
  if (promoted) {
    res.end();
  } else if (promoted === false) {
    res.writeHead(404);
    res.end("Service '" + service + "' not found");
  } else {
    res.writeHead(400);
    res.end("Please specify a service to promote");
  }
});

server.get("/query", function (req, res, next) {
  var response = registry.query(req.query.service);
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify(response));
});
