/*
 *  client.js
 *
 */
 

var net = require("net");
var util = require("util");
var localConnection = null;

// this function needs to be able to attempt lookups on a 
// remote registry, if the local registry fails to return a match
exports.lookup = function (service, opts, cb) {
  if (arguments.length < 3) {
    if (typeof opts === "function") {
      cb = opts;
      opts = null;
    } else if (typeof service === "function") {
      cb = service;
      service = null;
    }
    opts = null;
  }
  var con = new Connection(opts, function (err) {
    if (err) {
      cb && cb(err);
    } else {
      con.request("lookup", service, function (err, response) {
        if (err) {
          cb(err);
        } else {
          if (service && opts && opts.host === "localhost" && response.length === 0) {
            opts = {
              host: service, 
              port: exports.port
            };
            exports.lookup(service, opts, function (err, remoteResponse) {
              cb && cb(null, (err) ? response : remoteResponse);
            });
          } else {
            cb && cb(null, response);
          }
        }
      });
    }
  });
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


// helpers

function request (type, service, cb) {
  var con = new Connection(function (err) {
    if (err) {
      cb && cb(err);
    } else {
      con.request(type, service, cb);
    }
  });
}

function defaultConnectionOptions () {
  return {
    host: "localhost",
    port: exports.port || 1845
  }
}

function Connection (opts, cb) {
  if (typeof opts === "function") {
    cb = opts;
    opts = null;
  }
  opts = opts || defaultConnectionOptions();
  var self = this;
  self.con = net.connect(opts);
  self.con.on("connect", function () {
    self.con.on("error", function (err) {
      console.log("WE NEEDED THIS", err);
    });
    cb && cb();
  });
  self.con.on("error", function (err) {
    cb && cb(err);
  });
}

Connection.prototype.request = function (type, service, cb) {
  if (typeof service === "function") {
    cb = service;
    service = null;
  }
  this.con.once("data", this.respond.bind(this, cb));
  this.con.once("error", cb);
  this.con.write(JSON.stringify({
    action: type,
    service: service
  }));
}

Connection.prototype.respond = function (cb, response) {
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
  this.con.removeListener("error", cb);
  cb && cb(error, response);
}
