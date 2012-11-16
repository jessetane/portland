/*
 *  index.js
 *
 */


exports.createServer = function (port) {
  return require("./lib/server").listen(port || 1845);
}

exports.createClient = function (port, cb) {
  if (typeof port === "function") {
    cb = port;
    port = null;
  }
  return require("./lib/client").connect(port || 1845, cb);
}