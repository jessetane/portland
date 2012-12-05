/*
 *  server.js
 *
 */


var fs = require("fs")
var net = require("net")
var util = require("util")
var registry = require("./registry")

exports.listen = function (port) {
  server.listen(port || 1845)
  util._extend(server, registry)
  return server
}

var server = net.createServer(function (client) {
  client.on("data", function (request) {
    request = parseRequest(request)
    var response = request.error
    if (!response) {
      response = formatResponse(registry[request.action](request.service))
    }
    client.write(JSON.stringify(response))
  })
})

// helpers

function parseRequest (request) {
  try {
    request = JSON.parse(request)
  } catch (error) {
    return { error: error.message }
  }
  return validate(request)
}

function validate (request) {
  if (!request.action) {
    return { error: "please specify an action" }
  } else if (!registry[request.action]) {
    return { error: "action '" + request.action + "' not supported" }
  } else if (!request.service && request.action !== "lookup") {
    return { error: "please specify a service" }
  }
  return request
}

function formatResponse (response) {
  if (response instanceof Error) {
    return { 
      error: response.message,
      service: response.service
    }
  } else {
    return response
  }
}
