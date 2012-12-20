#!/usr/bin/env node

/*
 *  client.js
 *
 */


var assert = require("assert")
var portland = require("../")
var server = portland.createServer()

var ops = [
  
  function (cb) {
    // check length
    portland.lookup(function (err, resp) {
      assert.strictEqual(resp.length, 0)
      cb()
    })
  },
  
  function (cb) {
    // register a no-version service
    portland.register("myservice", cb)
  },
  
  function (cb) {
    // attempt to register another no-version service
    portland.register("myservice", function (err, resp) {
      assert(err)
      assert(resp.host)
      assert(resp.port)
      cb()
    })
  },

  function (cb) {
    // unregister the no-version service
    portland.unregister("myservice", function () {
      portland.lookup(function (err, resp) {
        assert.strictEqual(resp.length, 0)
        cb()
      })
    })
  },
  
  function (cb) {
    // alias (heretofore unregistered) service myservice as www.myservice
    portland.alias("myservice", "www.myservice", function (err, resp) {
      assert(resp)
      cb()
    })
  },
  
  function (cb) {
    // should be empty
    portland.lookup(function (err, resp) {
      assert.strictEqual(resp.length, 0)
      cb()
    })
  },
  
  function (cb) {
    // register a versioned service & specific alias
    portland.register("myservice@v0.0.1", "www.myservice@v0.0.1", function (err, resp) {
      assert(resp.host)
      assert(resp.version)
      assert(resp.port)
      cb()
    })
  },
  
  function (cb) {
    // general alias works?
    portland.lookup("www.myservice", function (err, resp) {
      assert.strictEqual(resp.length, 1)
      assert.strictEqual(resp[0].host, "myservice")
      assert.strictEqual(resp[0].version, "v0.0.1")
      cb()
    })
  },
  
  function (cb) {
    // register another
    portland.register("myservice@v0.0.2", function (err, resp) {
      assert.strictEqual(err instanceof Error, false)
      cb()
    })
  },
  
  function (cb) {
    // lookup with no args should return both services
    portland.lookup(function (err, resp) {
      assert.strictEqual(resp.length, 2)
      cb()
    })
  },
  
  function (cb) {
    // general alias still works?
    portland.lookup("www.myservice", function (err, resp) {
      assert.strictEqual(resp.length, 2)
      assert.strictEqual(resp[0].host, "myservice")
      assert.strictEqual(resp[0].version, "v0.0.1")
      cb()
    })
  },
  
  function (cb) {
    // promote the second one
    portland.promote("myservice@v0.0.2", function (err, resp) {
      assert.strictEqual(err instanceof Error, false)
      cb()
    })
  },
  
  function (cb) {
    // general alias respects promoted version?
    portland.lookup("www.myservice", function (err, resp) {
      assert.strictEqual(resp.length, 2)
      assert.strictEqual(resp[0].host, "myservice")
      assert.strictEqual(resp[0].version, "v0.0.2")
      cb()
    })
  },
  
  function (cb) {
    // more specific alias works?
    portland.lookup("www.myservice@v0.0.1", function (err, resp) {
      assert.strictEqual(resp.length, 1)
      assert.strictEqual(resp[0].host, "myservice")
      assert.strictEqual(resp[0].version, "v0.0.1")
      cb()
    })
  },
  
  function (cb) {
    // test unalias
    portland.unalias("www.myservice@v0.0.1", function (err, resp) {
      portland.lookup("www.myservice@v0.0.1", function (err, resp) {
        assert.strictEqual(resp.length, 0)
        cb()
      })
    })
  },
  
  function (cb) {
    // check order
    portland.lookup(function (err, resp) {
      assert.strictEqual(resp.length, 2)
      assert.strictEqual(resp[0].version, "v0.0.2")
      cb()
    })
  },
  
  function (cb) {
    // unregister the first one
    portland.unregister("myservice@v0.0.1", function (err, resp) {
      assert.strictEqual(resp instanceof Error, false)
      cb()
    })
  },
  
  function (cb) {
    // unregister the second one
    portland.unregister("myservice", function (err, resp) {
      assert.strictEqual(resp instanceof Error, false)
      cb()
    })
  },
  
  function (cb) {
    // check length
    portland.lookup(function (err, resp) {
      assert.strictEqual(resp.length, 0)
      cb()
    })
  }
  
]

function run () {
  if (ops.length) {
    var op = ops.shift()
    op(run)
  } else {
    console.log("✔  all tests passed!")
    process.exit(0)
  }
}

run()
