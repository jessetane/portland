/*
 *  proxy.js
 *
 */
 

var env = process.env;
env.PROXY_PORT = env.PROXY_PORT || 8000;

var express = require("express");
var httpProxy = require("http-proxy");
var portland = require("../index").createServer();

// proxy router
var proxy = new httpProxy.RoutingProxy();
proxy.on('upgrade', function(req, socket, head) {
  proxy.proxyWebSocketRequest(req, socket, head);
});

// http server stack
var server = express();
server.use(express.query());
server.use(proxyServices);
server.use(express.logger("tiny"));
server.listen(env.PROXY_PORT);
console.log("proxy listening on " + env.PROXY_PORT);

// proxy logic middleware
function proxyServices (req, res, next) {
  var serviceName = getServiceName(req);
  try {
    var services = portland.query(serviceName);
    proxy.proxyRequest(req, res, {
      host: "127.0.0.1",
      port: services[0].port
    });
  } catch (err) {
    next();
  }
}

// detect specific versions of a service via query param
function getServiceName (req) {
  var rawhost = req.headers.host;
  var parts = rawhost.split(":");
  var name = parts[0];
  var version = req.query.version;
  if (version) name += "@" + version
  return name;
}
