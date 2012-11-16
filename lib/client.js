/*
 *  client.js
 *
 */
 

var net = require("net");
var util = require("util");
var server = null;
var portofportland = null;

exports.query = function (service, cb) {
  request("query", service, cb);
}

exports.register = function (service, cb) {
  request("register", service, cb);
}

exports.free = function (service, cb) {
  request("free", service, cb);
}

exports.promote = function (service, cb) {
  request("promote", service, cb);
}

exports.connect = function (port, cb) {
  if (server) return cb && cb(new Error("already connected to server"));
  portofportland = port;
  var connection = net.connect({ port: portofportland }, function () {
    server = connection;
    server.on("error", connectionLost);
    server.on("end", connectionLost);
    cb && cb();
  });
  return util._extend(connection, exports);
}

// helpers

function verifyConnection (cb) {
  if (server) {
    server.once("data", respond.bind(null, cb));
    server.once("error", cb);
    server.once("end", cb);
    return true;
  } else {
    cb && cb(new Error("not connected to server"));
  }
}

function connectionLost (err) {
  server = null;
}

function request (type, service, cb) {
  if (typeof service === "function") {
    cb = service;
    service = undefined;
  }
  if (!verifyConnection(cb)) return;
  var json = JSON.stringify({
    action: type,
    service: service
  });
  server.write(json);
}

function respond (cb, response) {
  var error = null;
  try {
    response = JSON.parse(response);
    if (response.error) {
      error = new Error(response.error);
      if (response.services) {
        error.services = response.services;
      }
      response = null;
    }
  } catch (e) {
    response = null;
    error = e;
  }
  server.removeListener("end", cb);
  server.removeListener("error", cb);
  cb && cb(error, response);
}
