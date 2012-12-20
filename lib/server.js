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
      response = formatResponse(registry[request.action].apply(null, request.arguments))
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
  }
  return request
}

function formatResponse (response) {
  if (response instanceof Error) {
    var error = response.message
    response = util._extend({}, response)
    response.error = error
    return response
  } else {
    return response
  }
}
