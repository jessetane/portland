/*
 *  registry.js
 *
 */


var fs = require("fs");
var cache = null;
try {
  cache = JSON.parse(fs.readFileSync("../.cache"));
  console.log("loading worked");
} catch (err) {
  console.log("loading failed", err);
  cache = {};
}
var registry = cache.registry = cache.registry || {};
var ports = cache.ports = cache.ports || {};

exports.register = function (service) {
  if (!service) return null;
  var parts = service.split("@");
  var version = {
    version: parts.length > 1 && parts[1] || null,
    port: generatePort()
  }
  var versions = registry[version.name] || (registry[version.name] = []);
  versions.push(version);
  ports[version.port] = null;
  save();
  return version.port;
}

exports.free = function (service) {
  if (!service) return null;
  var parts = service.split("@");
  var name = parts[0];
  var version = parts.length > 1 && parts[1] || null;
  var freed = false;
  for (var r in registry) {
    if (r === name) {
      var versions = registry[r];
      if (version) {
        for (var v in versions) {
          if (semver.satisfies(v.version, version)) {
            versions.splice(v, 1);
            freed = true;
          }
        }
        if (versions.length === 0) {
          delete registry[name];
        }
      } else {
        delete registry[name];
        freed = true;
      }
      break;
    }
  }
  if (freed) save();
  return freed;
}

exports.promote = function (service) {
  if (!service) return null;
  var parts = service.split("@");
  var name = parts[0];
  var version = parts.length > 1 && parts[1] || null;
  var promoted = false;
  for (var r in registry) {
    if (r === name) {
      var versions = registry[r];
      if (version) {
        for (var v in versions) {
          if (semver.satisfies(v.version, version)) {
            versions.unshift(versions.splice(v, 1));
            promoted = true;
            break;
          }
        }
      }
      break;
    }
  }
  if (promoted) save();
  return promoted;
}

exports.query = function (service) {
  var services = [];
  if (service) {
    var parts = service.split("@");
    var name = parts[0];
    var version = parts.length > 1 && parts[1];
    for (var r in registry) {
      if (r === name) {
        var versions = registry[r];
        if (version) {
          for (var v in versions) {
            if (semver.satisfies(v.version, version)) {
              services.push(versions[v]);
            }
          }
        } else {
          services = versions;
        }
        break;
      }
    }
  } else {
    services = registry;
  }
  return services;
}

// helpers

function generatePort () {
  var port = null;
  do {
    port = 10000 + Math.floor(Math.random() * 10000);
  } while (port in ports);
  return String(port);
}

function save () {
  var str = JSON.stringify(cache);
  console.log(str);
  fs.writeFile(__dirname + "/../.cache", str, function (err) {
    if (err) {
      console.log("failed to cache");
    } else {
      console.log("cached");  
    }
  });
}
