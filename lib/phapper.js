var fs       = require('fs');
var execSync = require('exec-sync');
var exec     = require('child_process').exec;

function Phapper(script, args) {
    if (!script)
        throw new Error("Script required!");

    if (!fs.existsSync(script))
        throw new Error("Script ("+script+") not found!");

    this.script = script;

    if (args)
        this.args = args;
}

Phapper.prototype = {
    command: function () {
        return "phantomjs "
                + this.script + " "
                + this.args.join(" ");
    },

    runSync: function () {
        var result = execSync(this.command(), true);
        if (result.stderr)
            throw new Error(result.stderr);

        this.results = JSON.parse(result.stdout) || false;

        if (!this.results)
            throw new Error("Something went wrong parsing stdout to JSON: %j", result);

        return this.results;
    },

    run: function (callback) {
        return exec(this.command(), function (error, stdout, stderr) {
            if (error)
                throw new Error(error);

            if (stderr)
                throw new Error(stderr);

            var parsed = JSON.parse(stdout) || false;

            if (!parsed)
                throw new Error("Something went wrong parsing stdout to JSON: %j", parsed);

            callback(parsed, stdout);
        });
    },

};

module.exports = Phapper;

// vim: ft=javascript:
