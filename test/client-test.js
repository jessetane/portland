#!/usr/bin/env node

/*
 *  client-test.js
 *
 */


//var async = require("async");
var assert = require("assert");
var portland = require("../index");
var server = portland.createServer();
var client = portland.createClient(function () {
  
  // check empty
  client.query(function (err, resp) {
    //console.log(resp);
    assert.strictEqual(resp.length, 0);
    
    // register
    client.register("myservice@v0.0.1", function (err, resp) {
      //console.log(resp);
      assert.strictEqual(resp instanceof Error, false);
      assert.strictEqual(resp.host, "myservice");
      assert.strictEqual(resp.version, "v0.0.1");
      assert(resp.port);

      // register another
      client.register("myservice@v0.0.2", function (err, resp) {
        //console.log(resp);
        assert.strictEqual(resp instanceof Error, false);

        // promote the second one
        client.promote("myservice@v0.0.2", function (err, resp) {
          //console.log(resp);
          assert.strictEqual(resp instanceof Error, false);
          
          // check order
          client.query(function (err, resp) {
            //console.log(resp);
            assert.strictEqual(resp.length, 2);
            assert.strictEqual(resp[0].version, "v0.0.2");

            // free the first one
            client.free("myservice@v0.0.1", function (err, resp) {
              //console.log(resp);
              assert.strictEqual(resp instanceof Error, false);

              // free the second one
              client.free("myservice", function (err, resp) {
                //console.log(resp);
                assert.strictEqual(resp instanceof Error, false);

                // check empty
                client.query(function (err, resp) {
                  //console.log(resp);
                  assert.strictEqual(resp.length, 0);
                  client.destroy();
                  
                  // make sure disconnected client requests return error
                  client.query(function (err, resp) {
                    //console.log(err.stack);
                    assert(err instanceof Error);
                    console.log("✔  all tests passed!");
                    process.exit(0);
                  });
                  
                });
              });
            });
          });
        });
      });
    });
  });
});

// make sure disconnected client requests return error
client.query(function (err) {
  assert(err instanceof Error);
});
