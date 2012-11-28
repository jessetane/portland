#!/usr/bin/env node

/*
 *  portland.js
 *
 */


var cui = require("cui");
var portland = require("../");
var args = process.argv.slice(2);

cui.push({
  title: "choose an action:",
  type: "buttons",
  data: Object.keys(require("../lib/registry")),
  action: function (cb) {
    if (args.length === 1 && args[0] === "lookup") {
      cui.results.push("");
    } else {
      cui.push(services);
    }
    cui.push(perform);
    cb();
  }
});

var services = {
  type: "fields",
  data: [ "type a service name: " ]
};

function perform (cb) {
  var action = cui.last(2);
  var service = cui.last(1);
  portland[action](service, function (err, resp) {
    if (action === "register") {
      if (resp) {
        console.log(resp.port);
      }
    } else if (action === "lookup") {
      if (resp.length === 0) {
        err = new Error();
      } else if (service) {
        console.log(resp[0].port);
      } else {
        for (var s in resp) {
          service = resp[s];
          console.log(service.host + ":" + service.port);
        }
      }
    }
    cb();
    process.exit(err ? 1 : 0);
  });
}
