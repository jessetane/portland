#!/bin/sh

# get in __dirname
cd "$(dirname "$0")"/..

# executable
PDX="bin/portland.js"

# spin up a server
echo 'require("./").createServer()' > "test.js"
bash -c 'node test.js & echo $!' > pid

# check length
R=$($PDX lookup)
[[ $? == 1 || -n $R ]] && echo "assertion failed: $LINENO"

# register a no version service
PORT=$(pdx register myservice)
[[ $? == 1 || -z $PORT ]] && echo "assertion failed: $LINENO"

# attempt to register another no-version service
R=$(pdx register myservice 2> /dev/null)
#[[ $? != 1 || $R != $PORT ]] && echo "assertion failed: $LINENO"

# cleanup
PID=$(cat pid)
kill $PID
rm pid
rm test.js

#
echo "✔  all tests passed!"



# 
# // check length
# var resp = server.lookup()
# assert.strictEqual(resp.length, 0)
# 
# // register a no-version service
# resp = server.register("myservice")
# 
# // attempt to register another no-version service
# resp = server.register("myservice")
# assert(resp instanceof Error)
# assert(resp.host)
# assert(resp.port)
# 
# // unregister the no-version service
# server.unregister("myservice")
# resp = server.lookup()
# assert.strictEqual(resp.length, 0)
# 
# // alias (heretofore unregistered) service myservice as www.myservice
# resp = server.alias("myservice", "www.myservice")
# assert(resp)
# 
# // should be empty
# resp = server.lookup()
# assert.strictEqual(resp.length, 0)
# 
# // register a versioned service & specific alias
# resp = server.register("myservice@v0.0.1", "www.myservice@v0.0.1")
# assert.strictEqual(resp instanceof Error, false)
# assert(resp.host)
# assert(resp.version)
# assert(resp.port)
# 
# // general alias works?
# resp = server.lookup("www.myservice")
# assert.strictEqual(resp.length, 1)
# assert.strictEqual(resp[0].host, "myservice")
# assert.strictEqual(resp[0].version, "v0.0.1")
# 
# // register another
# resp = server.register("myservice@v0.0.2")
# assert.strictEqual(resp instanceof Error, false)
# 
# // lookup with no args should return both services
# resp = server.lookup()
# assert.strictEqual(resp.length, 2)
# 
# // general alias still works?
# resp = server.lookup("www.myservice")
# assert.strictEqual(resp.length, 2)
# assert.strictEqual(resp[0].host, "myservice")
# assert.strictEqual(resp[0].version, "v0.0.1")
# 
# // promote the second one
# resp = server.promote("myservice@v0.0.2")
# assert.strictEqual(resp instanceof Error, false)
# 
# // general alias respects promoted version?
# resp = server.lookup("www.myservice")
# assert.strictEqual(resp.length, 2)
# assert.strictEqual(resp[0].host, "myservice")
# assert.strictEqual(resp[0].version, "v0.0.2")
# 
# // more specific alias works?
# resp = server.lookup("www.myservice@v0.0.1")
# assert.strictEqual(resp.length, 1)
# assert.strictEqual(resp[0].host, "myservice")
# assert.strictEqual(resp[0].version, "v0.0.1")
# 
# // test unalias
# server.unalias("www.myservice@v0.0.1")
# resp = server.lookup("www.myservice@v0.0.1")
# assert.strictEqual(resp.length, 0)
# 
# // check order
# resp = server.lookup()
# assert.strictEqual(resp.length, 2)
# assert.strictEqual(resp[0].version, "v0.0.2")
# 
# // unregister the first one
# resp = server.unregister("myservice@v0.0.1")
# assert.strictEqual(resp instanceof Error, false)
# 
# // unregister the second one
# resp = server.unregister("myservice")
# assert.strictEqual(resp instanceof Error, false)
# 
# // check length
# resp = server.lookup()
# assert.strictEqual(resp.length, 0)
# 
# // close
# console.log("✔  all tests passed!")
# process.exit(0)
