var Phapper = require('lib/phapper');

module.exports = {
    setUp: function(cb) {
        Phapper.prototype.bin = "./test/support/phantomjs";
        cb();
    },

    'new Phapper()': function (test) {
        test.expect(1);

        test.throws(function () {
            var p = new Phapper();
        }, Error);

        test.done();
    },

    'new Phapper(script)': function (test) {
        test.expect(7);

        delete Phapper.prototype.bin;

        var phap = new Phapper("./test/support/json.js");
        test.ok(phap);
        test.ok(phap.script);
        test.ok(phap.args);
        test.deepEqual({}, phap.opts);
        test.equal("./test/support/json.js", phap.script);

        test.ok(phap.bin);
        test.ok(phap.bin.indexOf("/phantomjs") !== -1);

        test.done();
    },

    'new Phapper(script, args)': function (test) {
        test.expect(3);

        var phap = new Phapper("./test/support/json.js",
                    [ "--foo", "bar", "foobar" ]);

        test.ok(phap);
        test.ok(phap.args);
        test.equal("--foo", phap.args[0]);

        test.done();
    },

    'new Phapper(script, args, opts)': function (test) {
        test.expect(2);

        var phap = new Phapper("./json.js",
                    [ "--foo", "bar", "foobar" ],
                    { cwd: "./test/support/",
                      env: process.env });

        test.ok(phap.args);
        test.equal("./test/support/", phap.opts.cwd);
        test.done();
    },

    '#commandString()': function (test) {
        test.expect(4);

        var phap = new Phapper("./test/support/json.js",
                    [ "--foo", "bar", "foobar" ]);

        test.ok(phap.commandString());
        test.ok(phap.commandString()
                .indexOf("phantomjs ./test/support/json.js --foo bar foobar") !== -1);

        var phap = new Phapper("./test/support/json.js",
                    [ "--foo", "bar", "foobar" ],
                    { cwd: "./foobar" });

        test.equal(0, phap.commandString().indexOf("cd ./foobar &&"))

        test.ok(phap.commandString()
                .indexOf("phantomjs ./test/support/json.js --foo bar foobar") !== -1);

        test.done();
    },

    '#runSync() :: json output': function (test) {
        test.expect(3);

        var phjson = new Phapper("./test/support/json.js",
                    [ "--foo", "bar", "foobar" ]);

        var results = phjson.runSync();
        test.ok(results);
        test.ok(results.parsed.foo);
        test.ok("bar", results.parsed.foo);
        test.done();
    },

    '#runSync() :: string output': function (test) {
        test.expect(5);

        var phstr = new Phapper("./test/support/string.js",
                    [ "--foo", "bar", "foobar" ]);

        var results = phstr.runSync();

        test.ok(results);
        test.ok(results.stdout);
        test.ok(results.stderr);

        test.equal("stdout: foobar", results.stdout);
        test.equal("stderr: foobar", results.stderr);

        test.done();
    },

    '#run() :: json output': function (test) {
        test.expect(6);

        var phjson = new Phapper("./test/support/json.js",
                    [ "--foo", "bar", "foobar" ]);

        phjson.run( function (result, results_obj) {
            test.ok(result);
            test.ok(results_obj);

            test.equal("bar", result.foo);
            test.equal('{ \"foo\": \"bar\" }\n', results_obj.stdout);
            test.equal("", results_obj.stderr);
            test.equal(null, results_obj.error);
            test.done();
        });
    },

    '#run() :: string output': function (test) {
        test.expect(5);

        var phstr = new Phapper("./test/support/string.js",
                    [ "--foo", "bar", "foobar" ]);

        phstr.run( function (result, results_obj) {
            test.ok(result === undefined);
            test.ok(results_obj);

            test.equal("stdout: foobar\n", results_obj.stdout);
            test.equal("stderr: foobar\n", results_obj.stderr);
            test.equal(null, results_obj.error);
            test.done();
        });
    },

};

// vim: ft=javascript:
