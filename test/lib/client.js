/*
 *  client.js
 *
 */
 

var net = require("net");
var util = require("util");
var connection = null;
var portofportland = null;

exports.lookup = function (service, cb) {
  request("lookup", service, cb);
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

exports.connect = function (opts, cb) {
  if (connection) {
    cb && cb(new Error("already connected to server"));
  } else {
    var type = typeof opts;
    if (type === "undefined") {
      opts = {};
    } else if (type === "function") {
      cb = opts;
      opts = {};
    } else if (type === "string" || type === "number") {
      opts = { port: opts };
    }
    return openConnection(opts, cb);
  }
}

// helpers

function openConnection (opts, cb) {
  var wait = net.connect({ port: opts.port || 1845 }, function () {
    connection = util._extend(wait, exports);
    connection.removeAllListeners("error");
    connection.on("error", connectionLost);
    connection.on("end", connectionLost);
    cb && cb(null, connection);
  });
  wait.on("error", function (err) {
    if (opts.wait) {
      setTimeout(function () {
        openConnection.bind(null, opts, cb);
      }, 1000);
    } else {
      cb && cb(new Error("could not connect to server"));
    }
  });
  return wait;
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
      response = (response.service) ? response.service : null;
    }
  } catch (e) {
    response = null;
    error = e;
  }
  connection.removeListener("end", cb);
  connection.removeListener("error", cb);
  cb && cb(error, response);
}
