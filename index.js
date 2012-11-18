/*
 *  index.js
 *
 */


exports.createServer = function (port) {
  return require("./lib/server").listen(port);
}

exports.createClient = function (port, cb) {
  require("./lib/client").connect(port, cb);
}
