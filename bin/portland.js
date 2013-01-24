#!/usr/bin/env node

/*
 *  portland.js
 *
 */


var cui = require("cui")
var portland = require("../")
var args = process.argv.slice(2)

cui.push({
  title: "choose an action:",
  type: "buttons",
  data: Object.keys(require("../lib/registry"))
})

cui.push(function (cb) {
  var action = cui.last(1)
  var view = {
    type: "fields",
    data: "service to " + action + ": "
  }
  switch (action) {
    case "lookup":        // pdx lookup myserv
      cui.splice(function (cb) {
        if (args.length === 0 || args.length > 1) {
          cui.splice(view)
        }
        cb()
      })
      break
    case "unalias":       // pdx unalias www.myserv
      view.data = "aliases to remove : "
    case "register":      // pdx register myserv
    case "unregister":    // pdx unregister myserv
    case "alias":         // pdx alias myserv www.myserv
    case "promote":       // pdx promote myserv
      cui.splice(view)
      break
  }
  cb()
})

cui.push(function (cb) {
  if (cui.last(1) !== "") {
    for (var i=2; i<args.length; i++) {
      cui.results.push(args[i])
    }
  }
  cb()
})

cui.push(function (cb) {
  var action = cui.results.shift()
  cui.results.push(function (err, res) {
    if (err) {
      console.error(err.message)
    }
    switch (action) {
      case "lookup":
        if (cui.results.length === 1) {
          for (var r in res) {
            service = res[r]
            var version = (service.version) ? "@" + service.version : ""
            console.log(service.host + version + ":" + service.port)
          }
        } else if (res.length) {
          console.log(res[0].port)
        }
        break
      case "register":
        console.log(res.port)
        break
      case "unregister":
      case "alias":
      case "unalias":
      case "promote":
        break
    }
  })
  portland[action].apply(null, cui.results)
  cb()
})
