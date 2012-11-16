#!/usr/bin/env node

var portland = require("../../index").createClient();
portland.register("service1", function (err, port) {
  console.log(err, port);
});
