/*
 *  registry.js
 *
 */


var fs = require("fs");
var semver = require("semver");
var cache = loadCache();
var registry = cache.registry = cache.registry || {};
var ports = cache.ports = cache.ports || {};


exports.register = function (service) {
  if (!service) return new Error("please specify a service");
  var matches = match(service);
  if (matches.length) {
    var error = new Error("service '" + service + "' is already registered!")
    error.service = matches[0];
    return error;
  } else {
    var parts = service.split("@");
    var version = {
      host: parts[0],
      version: parts.length > 1 && parts[1] || null,
      port: generatePort()
    }
    var versions = registry[version.host] || (registry[version.host] = []);
    versions.push(version);
    ports[version.port] = null;
    saveCache();
    return version;
  }
}

exports.free = function (service) {
  if (!service) return new Error("please specify a service");
  var matches = match(service, true);
  if (matches.length) {
    for (var m in matches) {
      delete ports[matches[m].port];
    }
    saveCache();
    return matches;
  } else {
    return new Error("no services matching '" + service + "' found");
  }
}

exports.promote = function (service) {
  if (!service) return new Error("please specify a service");
  var matches = match(service, true);
  if (matches.length) {
    var host = matches[0].host;
    if (registry[host]) {
      registry[host] = matches.concat(registry[host]);
      saveCache();
      return matches;
    } else {
      registry[host] = matches;
      var error = new Error("no services were promoted");
      return error;
    }
  } else {
    return new Error("no services matching '" + service + "' found");
  }
}

exports.lookup = function (service) {
  return match(service);
}


// helpers

function match (service, extract) {
  var matches = [];
  if (!service) {
    for (var hosts in registry) {
      matches = matches.concat(registry[hosts]);
    }
    return matches;
  }
  var parts = service.split("@");
  var host = parts[0];
  var version = parts.length > 1 && parts[1] || null;
  for (var r in registry) {
    if (r === host) {
      var versions = registry[r];
      if (version) {
        for (var v in versions) {
          if (semver.satisfies(versions[v].version, version)) {
            if (extract) {
              matches = matches.concat(versions.splice(v, 1));
            } else {
              matches.push(versions[v]);
            }
          }
        }
        if (versions.length === 0 && extract) {
          delete registry[host];
        }
      } else {
        if (extract) {
          delete registry[host];
        }
        matches = versions;
      }
      break;
    }
  }
  return matches;
}

function generatePort () {
  var port = null;
  do {
    port = 10000 + Math.floor(Math.random() * 10000);
  } while (port in ports);
  return String(port);
}

function loadCache () {
  var cache = {};
  try {
    cache = JSON.parse(fs.readFileSync(__dirname + "/../.cache"));
  } catch (err) {}
  return cache;
}

function saveCache () {
  fs.writeFile(__dirname + "/../.cache", JSON.stringify(cache));
}
