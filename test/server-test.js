#!/usr/bin/env node

/*
 *  server-test.js
 *
 */


var assert = require("assert");
var portland = require("../index");
var server = portland.createServer();

// check empty
var resp = server.query();
//console.log(resp);
assert.strictEqual(resp.length, 0);

// register
resp = server.register("myservice@v0.0.1");
//console.log(resp);
assert.strictEqual(resp instanceof Error, false);
assert(resp.host);
assert(resp.version);
assert(resp.port);

// register another
resp = server.register("myservice@v0.0.2");
//console.log(resp);
assert.strictEqual(resp instanceof Error, false);

// promote the second one
resp = server.promote("myservice@v0.0.2");
//console.log(resp);
assert.strictEqual(resp instanceof Error, false);

// check order
var resp = server.query();
//console.log(resp);
assert.strictEqual(resp.length, 2);
assert.strictEqual(resp[0].version, "v0.0.2");

// free the first one
resp = server.free("myservice@v0.0.1");
//console.log(resp);
assert.strictEqual(resp instanceof Error, false);

// free the second one
resp = server.free("myservice");
//console.log(resp);
assert.strictEqual(resp instanceof Error, false);

// check empty
var resp = server.query();
//console.log(resp);
assert.strictEqual(resp.length, 0);

// close
console.log("✔  all tests passed!");
process.exit(0);
