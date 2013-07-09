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

        var phap = new Phapper("./test/support/example.js");
        test.ok(phap);
        test.ok(phap.script);
        test.equal("./test/support/example.js", phap.script);

        test.done();
    },

    'new Phapper(script, args)': function (test) {
        test.expect(3);

        var phap = new Phapper("./test/support/example.js",
                    [ "--foo", "bar", "foobar" ]);

        test.ok(phap);
        test.ok(phap.args);
        test.equal("--foo", phap.args[0]);

        test.done();
    },

    '#command()': function (test) {
        test.expect(2);

        var phap = new Phapper("./test/support/example.js",
                    [ "--foo", "bar", "foobar" ]);

        test.ok(phap.command());
        test.equal("phantomjs ./test/support/example.js --foo bar foobar",
                    phap.command());
        test.done();
    },

    '#runSync()': function (test) {
        test.expect(3);

        var phap = new Phapper("./test/support/example.js",
                    [ "--foo", "bar", "foobar" ]);

        var results = phap.runSync();
        test.ok(results);
        test.ok(results.foo);
        test.ok("bar", results.foo);
        test.done();
    },

    '#run()': function (test) {
        test.expect(4);

        var phap = new Phapper("./test/support/example.js",
                    [ "--foo", "bar", "foobar" ]);

        phap.run( function (result, raw_result) {
            test.ok(result);
            test.ok(raw_result);

            test.equal("bar", result.foo);
            test.equal('{ \"foo\": \"bar\" }\n', raw_result);
            test.done();
        });
    },

};

// vim: ft=javascript:
