/*
 *  index.js
 *
 */


exports.createServer = function (port) {
  return require("./lib/server").listen(port);
}

exports.createClient = function (port, cb) {
  return require("./lib/client").connect(port, cb);
}

// disposable client action wrappers
var actions = Object.keys(require("./lib/registry"));
for (var a in actions) {
  var action = actions[a];
  exports[action] = function (service, cb) {
    exports.createClient(exports.port, function (err, client) {
      if (!err && client) {
        client[action](service, function (err, data) {
          client.end();
          cb(err, data);
        });
      } else {
        client.end();
        cb(err);
      }
    });
  }
}
