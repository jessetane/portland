/*
 *  client.js
 *
 */
 

var net = require("net")
var util = require("util")

var TIMEOUT = 500


exports.lookup = function (service, opts, cb) {
  if (arguments.length < 3) {
    if (typeof opts === "function") {
      cb = opts
      opts = null
    } else if (typeof service === "function") {
      cb = service
      service = null
    }
    opts = null
  }
  var con = new Connection(opts, function (err) {
    if (err) {
      cb(err)
    } else {
      con.request("lookup", service, function (err, response) {
        con.destroy()
        if (err) {
          cb(err)
        } else {
          if (service && !opts && response.length === 0) {
            opts = defaultConnectionOptions()
            opts.host = service
            exports.lookup(service, opts, function (err, remoteResponse) {
              cb(null, (err) ? response : remoteResponse)
            })
          } else {
            cb(null, response)
          }
        }
      })
    }
  })
}

exports.register = function () {
  request.apply(null, wrapArgs("register", arguments))
}

exports.unregister = function () {
  request.apply(null, wrapArgs("unregister", arguments))
}

exports.alias = function () {
  request.apply(null, wrapArgs("alias", arguments))
}

exports.unalias = function () {
  request.apply(null, wrapArgs("unalias", arguments))
}

exports.promote = function () {
  request.apply(null, wrapArgs("promote", arguments))
}


// helpers

function wrapArgs (action, args) {
  var args = Array.prototype.slice.call(args)
  args.unshift(action)
  return args
}

function request () {
  var args = Array.prototype.slice.call(arguments)
  var con, temp = args.slice(-1)[0]
  var cb = args[args.length-1] = function () {
    con.destroy()
    temp.apply(null, arguments)
  }
  con = new Connection(function (err) {
    if (err) {
      cb(err)
    } else {
      con.request.apply(con, args)
    }
  })
}

function defaultConnectionOptions () {
  return {
    host: "localhost",
    port: exports.port || 1845
  }
}

function Connection (opts, cb) {
  if (typeof opts === "function") {
    cb = opts
    opts = null
  }
  opts = opts || defaultConnectionOptions()
  var self = this
  this.once("connect", function () {
    self.removeAllListeners("error")
    cb()
  })
  this.once("error", function (err) {
    self.destroy()
    cb(err)
  })
  this.once("close", function () {
    clearTimeout(timeout)
  })
  net.Socket.call(this, opts)
  this.connect(opts)
  var timeout = setTimeout(function () {
    if (!self.destroyed) {
      self.emit("error", new Error("timed out waiting for '" + opts.host + "'"))
    }
  }, TIMEOUT)
}
util.inherits(Connection, net.Socket)

Connection.prototype.request = function () {
  var args = Array.prototype.slice.call(arguments)
  var type = args.splice(0, 1)[0]
  var cb = args.splice(-1, 1)[0]
  var self = this
  var responder = this.response.bind(this, cb)
  this.once("data", responder)
  this.once("error", function (err) {
    self.destroy()
    cb(err)
  })
  this.write(JSON.stringify({
    action: type,
    arguments: args
  }))
}

Connection.prototype.response = function (cb, res) {
  var err = null
  try {
    res = JSON.parse(res)
    if (res.error) {
      err = new Error(res.error)
      delete res.error
    }
  } catch (e) {
    res = null
    err = e
  }
  this.removeListener("error", cb)
  cb(err, res)
}
