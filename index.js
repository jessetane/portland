/*
 *  index.js
 *
 */

exports.createServer = function (port) {
  return require("./lib/server").listen(port);
}

var client = require("./lib/client");
require("util")._extend(exports, client);