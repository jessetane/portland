/*
 *  client.js
 *
 */
 

var qs = require("querystring");
var request = require("request");
var portofportland = null;

exports.query = function (service, cb) {
  var opts = {
    url: "http://localhost:" + portofportland + "/query",
    method: "GET",
    json: { service: service }
  };
  request(opts, function (err, res, services) {
    cb(err, services);
  });
}

exports.register = function (service, cb) {
  var opts = {
    url: "http://localhost:" + portofportland + "/register",
    method: "POST",
    body: JSON.stringify({ service: service }),
    headers: {
      "content-type": "application/json"
    }
  };
  request(opts, function (err, res, port) {
    cb(err, port);
  });
}

exports.free = function (service, cb) {
  var opts = {
    url: "http://localhost:" + portofportland + "/free",
    method: "POST",
    body: JSON.stringify({ service: service }),
    headers: {
      "content-type": "application/json"
    }
  };
  request(opts, cb);
}

exports.promote = function (service, cb) {
  var opts = {
    url: "http://localhost:" + portofportland + "/promote",
    method: "POST",
    body: JSON.stringify({ service: service }),
    headers: {
      "content-type": "application/json"
    }
  };
  request(opts, cb);
}

exports.connect = function (port) {
  portofportland = port;
  return exports;
}
