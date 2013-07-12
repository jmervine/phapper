var Phapper = require('lib/phapper');

process.env.PATH = "./test/support:"+process.env.PATH;

module.exports = {
    'new Phapper()': function (test) {
        test.expect(2);

        test.throws(function () {
            var p = new Phapper();
        }, Error);

        test.throws(function () {
            var p = new Phapper("./bad/file.js");
        }, Error);

        test.done();
    },

    'new Phapper(script)': function (test) {
        test.expect(3);

        var phap = new Phapper("./test/support/json.js");
        test.ok(phap);
        test.ok(phap.script);
        test.equal("./test/support/json.js", phap.script);

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

    '#command()': function (test) {
        test.expect(2);

        var phap = new Phapper("./test/support/json.js",
                    [ "--foo", "bar", "foobar" ]);

        test.ok(phap.command());
        test.equal("phantomjs ./test/support/json.js --foo bar foobar",
                    phap.command());
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
