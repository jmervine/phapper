#!/usr/bin/env node

var Phapper = require('../lib/phapper');

var yslow = new Phapper("./test/support/yslow.js",
                        [ "--info", "basic", "http://mervine.net/about" ]);

console.log("Run Sync");
var results = yslow.runSync();
console.log("Results:\n%j", results);

console.log("\nRun Async");
yslow.run( function (result) {
    console.log("Results:\n%j", result);
});

