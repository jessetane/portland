/*
 *  client.js
 *
 */
 

var net = require("net");
var util = require("util");
var connection = null;
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
  if (connection) {
    cb && cb(new Error("already connected to server"));
  } else {
    if (typeof port === "function") {
      cb = port;
      port = null;
    }
    openConnection(port, cb);
  }
}

// helpers

function openConnection (port, cb) {
  var wait = net.connect({ port: port || 1845 }, function () {
    wait.removeAllListeners("error");
    connection = util._extend(wait, exports);
    connection.on("error", connectionLost);
    connection.on("end", connectionLost);
    cb && cb(connection);
  });
  wait.on("error", function (err) {
    setTimeout(openConnection.bind(null, port, cb), 1000);
  });
}

function connectionLost (err) {
  connection = null;
}

function prepareConnection (cb) {
  if (connection) {
    connection.once("data", respond.bind(null, cb));
    connection.once("error", cb);
    connection.once("end", cb);
    return true;
  } else {
    cb && cb(new Error("not connected to server"));
    return false;
  }
}

function request (type, service, cb) {
  if (typeof service === "function") {
    cb = service;
    service = null;
  }
  if (prepareConnection(cb)) {
    connection.write(JSON.stringify({
      action: type,
      service: service
    }));
  }
}

function respond (cb, response) {
  var error = null;
  try {
    response = JSON.parse(response);
    if (response.error) {
      error = new Error(response.error);
      if (response.service) {
        error.service = response.service;
      }
      response = null;
    }
  } catch (e) {
    response = null;
    error = e;
  }
  connection.removeListener("end", cb);
  connection.removeListener("error", cb);
  cb && cb(error, response);
}
