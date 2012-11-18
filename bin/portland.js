#!/usr/bin/env node

/*
 *  portland.js
 *
 */


var cui = require("cui");
var portland = require("../");
var client = null;


setTimeout(function () {
  if (!client) {
    console.log("waiting for a portland server...");
  }
}, 20);

portland.createClient(function (c) {
  client = c;
  cui.push(actions);
  cui.push(services);
  cui.push(perform);
});

var actions = {
  title: "choose an action:",
  type: "buttons",
  data: Object.keys(require("../lib/registry"))
};

var services = {
  type: "fields",
  data: [ "type a service name: " ]
};

function perform (cb) {
  var action = cui.last(2);
  var service = cui.last(1);
  client[action](service, function (err, resp) {
    if (action === "register") {
      if (err && err.service) {
        resp = err.service;
        err = null;
      }
      if (resp) console.log(resp.port);
    } else if (action === "query") {
      console.log(resp);
    }
    cb();
    process.exit(err ? 1 : 0);
  });
}
